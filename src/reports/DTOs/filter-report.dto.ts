import { IsBoolean, IsOptional, IsISO8601, IsString, IsInt, Min } from 'class-validator';

export class FilterReportDto {
  @IsOptional()
  @IsBoolean()
  withPrice?: boolean;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
