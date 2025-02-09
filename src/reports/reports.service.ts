import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { FilterReportDto } from './DTOs/filter-report.dto';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  getDeletedPercentage(): Observable<string> {
    return from(this.productRepository.count()).pipe(
      switchMap((total) =>
        from(this.productRepository.count({ where: { deletedAt: true } })).pipe(
          map((deleted) => {
            const percentage = total ? (deleted / total) * 100 : 0;
            return `The percentage of deleted products is ${percentage.toFixed(2)}%`;
          }),
          catchError((error: Error) => {
            console.error('Error fetching deleted percentage', error);
            return throwError(() => new Error('Error calculating deleted percentage.'));
          }),
        ),
      ),
      catchError((error: Error) => {
        console.error('Error fetching total product count', error);
        return throwError(() => new Error('Error calculating total product count.'));
      }),
    );
  }

  getNonDeletedPercentage(filter: FilterReportDto): Observable<number> {
    return from(this.productRepository.count()).pipe(
      switchMap((total) => {
        const query = this.productRepository.createQueryBuilder('product').where('product.deletedAt = false');

        if (filter.withPrice !== undefined) {
          filter.withPrice
            ? query.andWhere('product.price IS NOT NULL')
            : query.andWhere('product.price IS NULL');
        }

        if (filter.startDate && filter.endDate) {
          query.andWhere('product.createdAt BETWEEN :startDate AND :endDate', {
            startDate: `${filter.startDate}T00:00:00.000Z`,
            endDate: `${filter.endDate}T23:59:59.999Z`,
          });
        }

        return from(query.getCount()).pipe(
          map((nonDeletedCount) => (total ? (nonDeletedCount / total) * 100 : 0)),
          catchError((error: Error) => {
            console.error('Error fetching non-deleted percentage', error);
            return throwError(() => new Error('Error calculating non-deleted percentage.'));
          }),
        );
      }),
      catchError((error: Error) => {
        console.error('Error fetching total product count', error);
        return throwError(() => new Error('Error calculating total product count.'));
      }),
    );
  }

  getCustomReport(filter: FilterReportDto): Observable<{ message: string; count: number }> {
    let query = this.productRepository.createQueryBuilder('product');

    if (filter.withPrice !== undefined) {
      filter.withPrice
        ? query.andWhere('product.price IS NOT NULL')
        : query.andWhere('product.price IS NULL');
    }

    if (filter.startDate && filter.endDate) {
      query.andWhere('product.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }

    if (filter.brand) {
      query.andWhere('product.brand = :brand', { brand: filter.brand });
    }

    if (filter.model) {
      query.andWhere('product.model = :model', { model: filter.model });
    }

    if (filter.color) {
      query.andWhere('product.color = :color', { color: filter.color });
    }

    if (filter.stock !== undefined) {
      query.andWhere('product.stock = :stock', { stock: filter.stock });
    }

    return from(query.getCount()).pipe(
      switchMap((count: number) => {
        const message = this.generateReportMessage(count, filter);
        return of({ message, count });
      }),
      catchError((error: Error) => {
        console.error('Error generating custom report', error);
        return throwError(() => new Error('Error generating custom report.'));
      }),
    );
  }

  private generateReportMessage(count: number, filter: FilterReportDto): string {
    let message = `The custom report generated successfully.`;

    if (filter.startDate && filter.endDate) {
      message += ` The report is filtered by date range: ${filter.startDate} to ${filter.endDate}.`;
    }
    if (filter.brand) {
      message += ` The report includes products from the brand: ${filter.brand}.`;
    }
    if (filter.model) {
      message += ` The report includes products of model: ${filter.model}.`;
    }
    if (filter.color) {
      message += ` The report includes products of color: ${filter.color}.`;
    }
    if (filter.stock !== undefined) {
      message += ` The report includes products with ${filter.stock} stock.`;
    }
    if (filter.withPrice !== undefined) {
      message += ` The report is filtered by ${filter.withPrice ? 'products with a price' : 'products without a price'}.`;
    }

    message += ` Total products matching the filter criteria: ${count}.`;

    return message;
  }
}
