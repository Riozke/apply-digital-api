import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) { }

    @Query(() => [Product])
    getProducts(@Args('page', { type: () => Number, nullable: true }) page: number) {
        return this.productsService.getPaginatedProducts(page);
    }

    @Mutation(() => Boolean)
    deleteProduct(@Args('id') id: string) {
        return this.productsService.deleteProduct(id);
    }
}
