import { Product } from '../products/product.entity';

export type PaginatedProductsResponse = {
  statusCode: number;
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

export type SimpleResponse = {
  statusCode: number;
  message: string;
};

export type ProductListResponse = {
  statusCode: number;
  data: Product[];
};

export type PaginatedResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
