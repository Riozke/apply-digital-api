import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FilterReportDto } from './DTOs/filter-report.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/types/roles.enum';


@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Roles(Role.ADMIN)
  @Get('deleted-percentage')
  getDeletedPercentage(): Observable<string> {
    return this.reportsService.getDeletedPercentage().pipe(
      catchError((error) => {
        console.error('Error fetching deleted percentage', error);
        return throwError(() => new Error('Failed to fetch deleted percentage.'));
      }),
    );
  }

  @Roles(Role.ADMIN)
  @Get('non-deleted-percentage')
  getNonDeletedPercentage(@Query() filter: FilterReportDto): Observable<number> {
    return this.reportsService.getNonDeletedPercentage(filter).pipe(
      catchError((error) => {
        console.error('Error fetching non-deleted percentage', error);
        return throwError(() => new Error('Failed to fetch non-deleted percentage.'));
      }),
    );
  }

  @Roles(Role.USER)
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
