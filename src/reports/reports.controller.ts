import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FilterReportDto } from './DTOs/filter-report.dto';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('deleted-percentage')
  getDeletedPercentage(): Observable<string> {
    return this.reportsService.getDeletedPercentage().pipe(
      catchError((error) => {
        console.error('Error fetching deleted percentage', error);
        return throwError(() => new Error('Failed to fetch deleted percentage.'));
      }),
    );
  }

  @Get('non-deleted-percentage')
  getNonDeletedPercentage(@Query() filter: FilterReportDto): Observable<number> {
    return this.reportsService.getNonDeletedPercentage(filter).pipe(
      catchError((error) => {
        console.error('Error fetching non-deleted percentage', error);
        return throwError(() => new Error('Failed to fetch non-deleted percentage.'));
      }),
    );
  }

  @Get('custom-report')
  getCustomReport(@Query() filter: FilterReportDto): Observable<any> {
    return this.reportsService.getCustomReport(filter).pipe(
      catchError((error) => {
        console.error('Error generating custom report', error);
        return throwError(() => new Error('Failed to generate custom report.'));
      }),
    );
  }
}
