import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FilterReportDto } from './DTOs/filter-report.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorator/roles.decorator';
import { Role } from '../types/roles.enum';
import { ApiOperation, ApiResponse, ApiQuery, ApiSecurity, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('deleted-percentage')
  @ApiOperation({
    summary: 'Get the percentage of deleted items',
    description: 'Fetches the percentage of items that have been marked as deleted.'
  })
  @ApiResponse({
    status: 200,
    description: 'Percentage of deleted items retrieved successfully.',
    type: String
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while fetching deleted percentage.'
  })
  @ApiSecurity('JWT', ['admin'])
  getDeletedPercentage(): Observable<string> {
    return this.reportsService.getDeletedPercentage().pipe(
      catchError((error) => {
        console.error('Error fetching deleted percentage', error);
        return throwError(() => new Error('Failed to fetch deleted percentage.'));
      }),
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('non-deleted-percentage')
  @ApiOperation({
    summary: 'Get the percentage of non-deleted items',
    description: 'Fetches the percentage of items that have not been marked as deleted.'
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: FilterReportDto,
    description: 'Optional filter for report'
  })
  @ApiResponse({
    status: 200,
    description: 'Percentage of non-deleted items retrieved successfully.',
    type: Number
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while fetching non-deleted percentage.'
  })
  @ApiSecurity('JWT', ['admin'])
  getNonDeletedPercentage(@Query() filter: FilterReportDto): Observable<string> {
    return this.reportsService.getNonDeletedPercentage(filter).pipe(
      catchError((error) => {
        console.error('Error fetching non-deleted percentage', error);
        return throwError(() => new Error('Failed to fetch non-deleted percentage.'));
      }),
    );
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('custom-report')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generate a custom report based on filter',
    description: 'Generates a custom report based on provided filters such as product attributes, date range, etc.'
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: FilterReportDto,
    description: 'Filter criteria for custom report'
  })
  @ApiResponse({
    status: 200,
    description: 'Custom report generated successfully.'
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while generating custom report.'
  })
  @ApiSecurity('JWT', ['user'])
  getCustomReport(@Query() filter: FilterReportDto): Observable<{ message: string; count: number; }> {
    return this.reportsService.getCustomReport(filter).pipe(
      catchError((error) => {
        console.error('Error generating custom report', error);
        return throwError(() => new Error('Failed to generate custom report.'));
      }),
    );
  }
}
