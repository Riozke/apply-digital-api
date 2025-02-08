import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getPaginatedProducts(
        @Query('page') page = 1,
        @Query('limit') limit = 5,
        @Query('name') name?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number
    ) {
        return this.productsService.getPaginatedProducts(page, limit, { name, category, minPrice, maxPrice });
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }

    @Get('all')
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get('manual-fetch')
    async manualFetch() {
        await this.productsService.fetchAndStoreProducts();
        return { message: 'Manual fetch initiated' };
    }
}


