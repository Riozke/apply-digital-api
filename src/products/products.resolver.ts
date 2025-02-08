import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) { }
}
