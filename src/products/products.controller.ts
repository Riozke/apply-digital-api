import { Controller, Get, Query, Delete, Param, ValidationPipe } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductsService } from './products.service';
import { PaginatedProductsResponse, ProductListResponse, SimpleResponse } from 'src/types';
import { GetProductsDTO } from './DTOs/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  getPaginatedProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsDTO
  ): Observable<PaginatedProductsResponse> {
    const { page, limit, ...filters } = query;

    return this.productsService.getPaginatedProducts(page, limit, filters).pipe(
      map((products) => ({
        statusCode: 200,
        data: products.data,
        total: products.total,
        page,
        limit,
      })),
      catchError((err) =>
        of({
          statusCode: err.status || 500,
          data: [],
          total: 0,
          page,
          limit,
          error: err.message,
        })
      )
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string): Observable<SimpleResponse> {
    return this.productsService.deleteProduct(id).pipe(
      map(() => ({ statusCode: 200, message: `Product with id ${id} deleted successfully` })),
      catchError((err) => {
        return of({
          statusCode: err.status || 500,
          message: `Failed to delete product with id ${id}`,
          error: err.message,
        });
      })
    );
  }

  @Get('all')
  getAllProducts(): Observable<ProductListResponse> {
    return this.productsService.getAllProducts().pipe(
      map((products) => ({ statusCode: 200, data: products })),
      catchError((err) => {
        return of({
          statusCode: err.status || 500,
          data: [],
          error: err.message,
        });
      })
    );
  }

  @Get('manual-fetch')
  manualFetch(): Observable<SimpleResponse> {
    return this.productsService.fetchAndStoreProducts().pipe(
      map(() => ({ statusCode: 200, message: 'Manual fetch initiated' })),
      catchError((err) => {
        return of({
          statusCode: err.status || 500,
          message: 'Error fetching products',
          error: err.message,
        });
      })
    );
  }
}
