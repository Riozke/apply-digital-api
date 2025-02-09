import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { of } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue(of('Hello World!')),
            getVersion: jest.fn().mockReturnValue(of('1.0.0')),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return an observable with "Hello World!"', (done) => {
      appController.getHello().subscribe((response) => {
        expect(response).toBe('Hello World!');
        done();
      });
    });
  });

  describe('getVersion', () => {
    it('should return an observable with "1.0.0"', (done) => {
      appController.getVersion().subscribe((response) => {
        expect(response).toBe('1.0.0');
        done();
      });
    });
  });
});
