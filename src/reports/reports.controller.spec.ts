import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { of, throwError } from 'rxjs';
import { FilterReportDto } from './DTOs/filter-report.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            getDeletedPercentage: jest.fn(),
            getNonDeletedPercentage: jest.fn(),
            getCustomReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
  });

  describe('getDeletedPercentage', () => {
    it('should return the percentage of deleted items', (done) => {
      const result = '10%';
      jest.spyOn(reportsService, 'getDeletedPercentage').mockReturnValue(of(result));

      controller.getDeletedPercentage().subscribe({
        next: (response) => {
          expect(response).toBe(result);
          done();
        },
        error: (err) => done(err),
      });
    });

    it('should handle errors', (done) => {
      const errorMessage = 'Failed to fetch deleted percentage.';
      jest.spyOn(reportsService, 'getDeletedPercentage').mockReturnValue(throwError(() => new Error(errorMessage)));

      controller.getDeletedPercentage().subscribe({
        error: (err) => {
          expect(err.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return the percentage of non-deleted items', (done) => {
      const result = 90;
      jest.spyOn(reportsService, 'getNonDeletedPercentage').mockReturnValue(of(result));

      controller.getNonDeletedPercentage(new FilterReportDto()).subscribe({
        next: (response) => {
          expect(response).toBe(result);
          done();
        },
        error: (err) => done(err),
      });
    });
  });

  describe('getCustomReport', () => {
    it('should return a custom report', (done) => {
      const reportData = { data: 'some data', message: 'random message', count: 1 };
      jest.spyOn(reportsService, 'getCustomReport').mockReturnValue(of(reportData));

      controller.getCustomReport(new FilterReportDto()).subscribe({
        next: (response) => {
          expect(response).toEqual(reportData);
          done();
        },
        error: (err) => done(err),
      });
    });
  });
});
