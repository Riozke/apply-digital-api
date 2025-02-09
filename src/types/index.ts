import { Product } from "src/products/product.entity";

export type StatusCodeResponse = {
  statusCode: number;
};

export type MessageResponse = StatusCodeResponse & {
  message: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type PaginatedProductsResponse = PaginatedResponse<Product>;

export type SimpleResponse = MessageResponse;

export type ProductListResponse = StatusCodeResponse & {
  data: Product[];
};

export interface JwtPayload {
  username: string;
  sub: string;
  role?: string;
}

export interface User {
  domain: string;
  email: string;
  password: string;
  role: string;
}

export interface ProductDto {
  id: string;
  name: string;
  category: string;
  price: number | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  stock: number | null;
}
