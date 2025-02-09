import { IsBoolean, IsOptional, IsISO8601, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterReportDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Optional flag to include price in the report',
    type: Boolean,
    required: false,
  })
  withPrice?: boolean;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    description: 'Optional start date filter for the report in ISO 8601 format',
    type: String,
    required: false,
    example: '2023-01-01T00:00:00Z',
  })
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    description: 'Optional end date filter for the report in ISO 8601 format',
    type: String,
    required: false,
    example: '2023-12-31T23:59:59Z',
  })
  endDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional filter by product brand',
    type: String,
    required: false,
  })
  brand?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional filter by product model',
    type: String,
    required: false,
  })
  model?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional filter by product color',
    type: String,
    required: false,
  })
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Optional filter for minimum stock of the product',
    type: Number,
    required: false,
    example: 10,
  })
  stock?: number;
}
