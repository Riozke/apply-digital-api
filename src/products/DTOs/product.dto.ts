import {
  IsInt, Min, Max, IsOptional, IsString, IsNumber, ValidateIf
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsDTO {
  @ApiProperty({
    description: 'Page number for pagination (default is 1)',
    required: false,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value ?? 1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (default is 5, max value is 5)',
    required: false,
    type: Number,
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => value ?? 5)
  limit?: number = 5;

  @ApiProperty({
    description: 'Search by product name (trims spaces automatically)',
    required: false,
    type: String,
    example: 'Smartphone',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Filter by product category (trims spaces automatically)',
    required: false,
    type: String,
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  category?: string;

  @ApiProperty({
    description: 'Filter by minimum price (must be at least 0)',
    required: false,
    type: Number,
    example: 10.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10000)
  minPrice?: number;

  @ApiProperty({
    description: 'Filter by maximum price (must be greater than minPrice)',
    required: false,
    type: Number,
    example: 100.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10000)
  @ValidateIf((dto) => dto.minPrice !== undefined && dto.maxPrice !== undefined)
  maxPrice?: number;
}
