import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsPositive, Min, Max } from 'class-validator';

export class PaginatedQueryDTO {
    @ApiPropertyOptional({ description: 'Page number (default: 1)', example: 1 })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Page must be an integer' })
    @IsPositive({ message: 'Page must be a positive number' })
    @Min(1, { message: 'Page must be at least 1' })
    page: number = 1;

    @ApiPropertyOptional({ description: 'Items per page (default: 5, max: 5)', example: 5 })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: 'Limit must be an integer' })
    @IsPositive({ message: 'Limit must be a positive number' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(5, { message: 'Limit cannot exceed 5' })
    limit: number = 5;
}
