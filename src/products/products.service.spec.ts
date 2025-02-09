import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, map, of, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: Repository<Product>;
  let httpService: HttpService;

  const mockProductRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    }),
  };

  

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndStoreProducts', () => {
    it('should fetch and store products successfully', (done) => {
      const mockResponse = {
        data: {
          items: [
            {
              sys: { id: '1' },
              fields: {
                name: 'Product 1',
                category: 'Category 1',
                price: '10',
                brand: 'Brand 1',
                model: 'Model 1',
                color: 'Red',
                stock: '100',
              },
            },
          ],
        },
      };

      const mockExistingProduct = null;
      mockHttpService.get.mockReturnValue(of(mockResponse));
      mockProductRepo.findOne.mockReturnValue(Promise.resolve(mockExistingProduct));
      mockProductRepo.save.mockReturnValue(Promise.resolve(undefined));

      service.fetchAndStoreProducts().subscribe({
        next: () => {
          expect(mockProductRepo.save).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
      mockProductRepo.find.mockResolvedValue(mockProducts);

      return service.getAllProducts().pipe(
        map((products) => {
          expect(products).toEqual(mockProducts);
        })
      ).toPromise();
    });
  });

  describe('getPaginatedProducts', () => {
    it('should return paginated products without filters', async () => {
      const mockProducts: Product[] = [
        {
          id: '1', name: 'Product 1',
          category: '',
          price: 0,
          brand: '',
          model: '',
          color: '',
          stock: 0,
          deletedAt: false,
          createdAt: undefined,
          updatedAt: undefined
        },
        {
          id: '2', name: 'Product 2',
          category: '',
          price: 0,
          brand: '',
          model: '',
          color: '',
          stock: 0,
          deletedAt: false,
          createdAt: undefined,
          updatedAt: undefined
        }
      ];
      const totalProducts = 10;

      mockProductRepo.createQueryBuilder().getManyAndCount.mockResolvedValue([mockProducts, totalProducts]);

      const result = await service.getPaginatedProducts(1, 5).toPromise();

      expect(result).toEqual({
        data: mockProducts,
        total: totalProducts,
        page: 1,
        limit: 5,
      });

      expect(mockProductRepo.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockProductRepo.createQueryBuilder().getManyAndCount).toHaveBeenCalled();
    });

    it('should return paginated products with name filter', async () => {
      const mockProducts: Product[] = [
        {
          id: '1', name: 'Product 1',
          category: '',
          price: 0,
          brand: '',
          model: '',
          color: '',
          stock: 0,
          deletedAt: false,
          createdAt: undefined,
          updatedAt: undefined
        }
      ];
      const totalProducts = 1;

      mockProductRepo.createQueryBuilder().getManyAndCount.mockResolvedValue([mockProducts, totalProducts]);

      const filters = { name: 'Product 1' };
      const result = await service.getPaginatedProducts(1, 5, filters).toPromise();

      expect(result).toEqual({
        data: mockProducts,
        total: totalProducts,
        page: 1,
        limit: 5,
      });

      expect(mockProductRepo.createQueryBuilder().andWhere).toHaveBeenCalledWith('product.name ILIKE :name', { name: '%Product 1%' });
    });

    it('should return paginated products with multiple filters', async () => {
      const mockProducts: Product[] = [
        {
          id: '1', name: 'Product 1', price: 100, category: 'Category1',
          brand: '',
          model: '',
          color: '',
          stock: 0,
          deletedAt: false,
          createdAt: undefined,
          updatedAt: undefined
        }
      ];
      const totalProducts = 1;

      mockProductRepo.createQueryBuilder().getManyAndCount.mockResolvedValue([mockProducts, totalProducts]);

      const filters = { name: 'Product 1', category: 'Category1', minPrice: 50, maxPrice: 200 };
      const result = await service.getPaginatedProducts(1, 5, filters).toPromise();

      expect(result).toEqual({
        data: mockProducts,
        total: totalProducts,
        page: 1,
        limit: 5,
      });

      expect(mockProductRepo.createQueryBuilder().andWhere).toHaveBeenCalledWith('product.name ILIKE :name', { name: '%Product 1%' });
      expect(mockProductRepo.createQueryBuilder().andWhere).toHaveBeenCalledWith('product.category = :category', { category: 'Category1' });
      expect(mockProductRepo.createQueryBuilder().andWhere).toHaveBeenCalledWith('product.price >= :minPrice', { minPrice: 50 });
      expect(mockProductRepo.createQueryBuilder().andWhere).toHaveBeenCalledWith('product.price <= :maxPrice', { maxPrice: 200 });
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product successfully', (done) => {
      const mockProduct: Product = {
        id: '1', name: 'Product 1', deletedAt: false,
        category: '',
        price: 0,
        brand: '',
        model: '',
        color: '',
        stock: 0,
        createdAt: undefined,
        updatedAt: undefined
      };
      mockProductRepo.findOne.mockReturnValue(Promise.resolve(mockProduct));
      mockProductRepo.save.mockReturnValue(Promise.resolve(mockProduct));

      service.deleteProduct('1').subscribe({
        next: () => {
          expect(mockProductRepo.save).toHaveBeenCalledWith(expect.objectContaining({ deletedAt: true }));
          done();
        },
        error: done.fail,
      });
    });
  });
});
