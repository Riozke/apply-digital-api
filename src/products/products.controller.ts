import { Controller, Get, Query, Delete, Param, ValidationPipe } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductsService } from './products.service';
import { PaginatedProductsResponse, ProductListResponse, SimpleResponse } from 'src/types';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaginatedQueryDTO } from './DTOs/paginated.dto';
import { SimpleResponseDTO } from './DTOs/simple.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Get paginated products list' })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the paginated product list.',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while fetching the products.',
  })
  getPaginatedProducts(
    @Query(new ValidationPipe({ transform: true })) query: PaginatedQueryDTO
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

  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while fetching all products.',
  })
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
  @ApiOperation({ summary: 'Initiate manual product fetch' })
  @ApiResponse({
    status: 200,
    description: 'Manual fetch initiated successfully.',
    type: SimpleResponseDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while fetching products.',
    type: SimpleResponseDTO,
  })
  manualFetch(): Observable<SimpleResponseDTO> {
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the product to delete',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
    type: SimpleResponseDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete product.',
    type: SimpleResponseDTO,
  })
  deleteProduct(@Param('id') id: string): Observable<SimpleResponseDTO> {
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
}
