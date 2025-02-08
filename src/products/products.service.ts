import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Cron } from '@nestjs/schedule';
import { PaginatedResponse } from '../types/index';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly httpService: HttpService,
  ) { }

  fetchAndStoreProducts(): Observable<void> {
    const url = `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=${process.env.CONTENTFUL_CONTENT_TYPE}`;

    return this.httpService.get(url).pipe(
      switchMap((response) => {
        const products = response.data.items.map((item) => ({
          id: item.sys.id,
          name: item.fields.name,
          category: item.fields.category,
          price: Number(item.fields.price) || null,
        }));

        // Verifica si los productos se están recuperando correctamente
        this.logger.log(`Fetched ${products.length} products from Contentful`);

        return of(products);
      }),
      concatMap((products) => {
        // Para cada producto, realizar la operación de guardado secuencialmente
        return from(
          Promise.all(
            products.map((product) =>
              this.productRepo.findOne({ where: { id: product.id }, withDeleted: true }).then((existing) => {
                if (!existing) {
                  // Si no existe el producto, se guarda en la base de datos
                  return this.productRepo.save(this.productRepo.create(product));
                } else if (existing.deletedAt) {
                  // Si el producto existe pero está marcado como eliminado, se omite
                  this.logger.warn(`Skipping deleted product: ${product.id}`);
                  return null;
                }
                // Si el producto ya existe y no está eliminado, no hace nada
                return null;
              })
            )
          )
        );
      }),
      map(() => {
        // Al finalizar, muestra un mensaje de éxito
        this.logger.log('Products synchronized successfully');
      }),
      catchError((error) => {
        // Si ocurre un error, muestra un mensaje de error
        this.logger.error(`Error fetching products: ${error.message}`);
        return of(null);
      })
    );
  }


  getAllProducts(): Observable<Product[]> {
    return from(this.productRepo.find()).pipe(
      catchError((error) => {
        this.logger.error(`Error fetching all products: ${error.message}`);
        return of([]);
      }),
    );
  }

  getPaginatedProducts(
    page: number = 1,
    limit: number = 5,
    filters?: { name?: string; category?: string; minPrice?: number; maxPrice?: number },
  ): Observable<PaginatedResponse> {
    const query = this.productRepo.createQueryBuilder('product').where('product.deletedAt IS false');

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

    return from(query.take(limit).skip((page - 1) * limit).getManyAndCount()).pipe(
      map(([data, total]) => {
        console.log("Data: ", data);
        console.log("Total: ", total);
        return { data, total, page, limit };
      }),
      catchError((error) => {
        this.logger.error(`Error fetching paginated products: ${error.message}`);
        return of({ data: [], total: 0, page, limit });
      }),
    );
  }


  deleteProduct(id: string): Observable<void> {
    return from(this.productRepo.findOne({ where: { id } })).pipe(
      switchMap((product) => {
        if (!product) {
          return throwError(() => new NotFoundException(`Product with id ${id} not found`));
        }

        return from(this.productRepo.softDelete(id)).pipe(map(() => { }));
      }),
      catchError((error) => {
        this.logger.error(`Error deleting product: ${error.message}`);
        return of(null);
      }),
    );
  }

  @Cron('0 * * * *')
  handleCron(): Observable<void> {
    return this.fetchAndStoreProducts();
  }
}
