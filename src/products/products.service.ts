import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly httpService: HttpService,
  ) { }

  async fetchAndStoreProducts() {
    try {
      const url = `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=${process.env.CONTENTFUL_CONTENT_TYPE}`;
      const response = await firstValueFrom(this.httpService.get(url));


      const products = response.data.items.map(item => ({
        id: item.sys.id,
        name: item.fields.name,
        category: item.fields.category,
        price: Number(item.fields.price) || null,
      }));

      for (const product of products) {

        console.log(product)
        const existing = await this.productRepo.findOne({ where: { id: product.id }, withDeleted: true });

        if (!existing) {
          await this.productRepo.save(this.productRepo.create(product));
        } else if (existing.deletedAt) {
          this.logger.warn(`Skipping deleted product: ${product.id}`);
        }
      }
      this.logger.log('Products synchronized successfully');
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async getPaginatedProducts(
    page: number = 1,
    limit: number = 5,
    filters?: { name?: string; category?: string; minPrice?: number; maxPrice?: number },
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {

    const query = this.productRepo.createQueryBuilder('product')
      .where('product.deletedAt IS false');

    if (filters?.name) {
      query.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters?.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters?.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters?.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const [data, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }


  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepo.softDelete(id);
  }

  @Cron('0 * * * *')
  async handleCron() {
    await this.fetchAndStoreProducts();
  }
}
