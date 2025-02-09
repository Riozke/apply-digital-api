import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { PaginatedQueryDTO } from './DTOs/paginated.dto';
import { PaginatedProductsResponse } from 'src/types';
import { Product } from './product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getPaginatedProducts: jest.fn(),
            deleteProduct: jest.fn(),
            getAllProducts: jest.fn(),
            fetchAndStoreProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('getPaginatedProducts', () => {
    it('should return paginated products list', async () => {
      const mockResponse: PaginatedProductsResponse = {
        data: [
          {
            id: '1',
            name: 'Product 1',
            category: 'Category 1',
            price: 100,
            brand: 'Brand 1',
            model: 'Model 1',
            color: 'red',
            stock: 40,
            deletedAt: false,
            createdAt: new Date(12312313),
            updatedAt: new Date(123123),
          }
        ],
        total: 1,
        page: 1,
        limit: 5,
      };

      jest.spyOn(productsService, 'getPaginatedProducts').mockReturnValue(of(mockResponse));

      const result = await controller.getPaginatedProducts({ page: 1, limit: 5 } as PaginatedQueryDTO).toPromise();
      expect(result.page).toBe(1);
      expect(result.data.length).toBe(1);
    });

    it('should handle errors when fetching products', async () => {
      const errorResponse = {
        statusCode: 500,
        data: [],
        total: 0,
        page: 1,
        limit: 5,
        error: 'Error occurred',
      };

      jest.spyOn(productsService, 'getPaginatedProducts').mockReturnValue(throwError(errorResponse));

      const result = await controller.getPaginatedProducts({ page: 1, limit: 5 } as PaginatedQueryDTO).toPromise();
      expect(result.total).toBe(0);
      expect(result).toStrictEqual({ "data": [], "error": undefined, "limit": 5, "page": 1, "statusCode": 500, "total": 0 });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          category: 'Category 1',
          price: 100,
          brand: 'Brand 1',
          model: 'Model 1',
          color: 'red',
          stock: 40,
          deletedAt: false,
          createdAt: new Date(12312313),
          updatedAt: new Date(123123),
        },
      ];

      jest.spyOn(productsService, 'getAllProducts').mockReturnValue(of(mockProducts));

      const result = await controller.getAllProducts().toPromise();
      expect(result.statusCode).toBe(200);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Product 1');
    });

    it('should handle errors when fetching products', async () => {
      const errorResponse = {
        statusCode: 500,
        message: 'Error occurred',
      };

      jest.spyOn(productsService, 'getAllProducts').mockReturnValue(throwError(errorResponse));

      const result = await controller.getAllProducts().toPromise();
      expect(result.statusCode).toBe(500);
      expect(result).toStrictEqual({ "data": [], "error": "Error occurred", "statusCode": 500 });
      expect(result.data.length).toBe(0);
    });
  });

  describe('manualFetch', () => {
    it('should initiate manual fetch successfully', async () => {
      jest.spyOn(productsService, 'fetchAndStoreProducts').mockReturnValue(of(undefined));

      const result = await controller.manualFetch().toPromise();
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Manual fetch initiated');
    });

    it('should handle errors when fetching products', async () => {
      const errorResponse = {
        statusCode: 500,
        message: 'Error fetching products',
      };

      jest.spyOn(productsService, 'fetchAndStoreProducts').mockReturnValue(throwError(errorResponse));

      const result = await controller.manualFetch().toPromise();
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Error fetching products');
      expect(result.error).toBe('Error fetching products');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const productId = '1';

      jest.spyOn(productsService, 'deleteProduct').mockReturnValue(of(undefined));

      const result = await controller.deleteProduct(productId).toPromise();
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe(`Product with id ${productId} deleted successfully`);
    });

    it('should handle errors when failing to delete a product', async () => {
      const productId = '1';
      const errorResponse = {
        statusCode: 500,
        message: `Failed to delete product with id ${productId}`,
      };

      jest.spyOn(productsService, 'deleteProduct').mockReturnValue(throwError(errorResponse));

      const result = await firstValueFrom(controller.deleteProduct(productId));
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe(`Failed to delete product with id ${productId}`);
      expect(result.error).toBe('Failed to delete product with id 1');
    });
  });
});
