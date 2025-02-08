import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductsService } from './products.service';
import { Product } from './product.entity'; // Asegúrate de importar tu entidad o DTO correspondiente.

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  getPaginatedProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number
  ): Observable<{ statusCode: number, data: Product[], total: number, page: number, limit: number }> {
    return this.productsService.getPaginatedProducts(page, limit, { name, category, minPrice, maxPrice }).pipe(
      map((products) => ({
        statusCode: 200,
        data: products.data, // Cambié de `items` a `data`
        total: products.total,
        page,
        limit
      })),
      catchError((err) => {
        return of({
          statusCode: err.status || 500,
          data: [],
          total: 0,
          page,
          limit,
          error: err.message,
        });
      })
    );
  }


  @Delete(':id')
  deleteProduct(@Param('id') id: string): Observable<{ statusCode: number, message: string }> {
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
  getAllProducts(): Observable<{ statusCode: number, data: Product[] }> {
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
  manualFetch(): Observable<{ statusCode: number, message: string }> {
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
