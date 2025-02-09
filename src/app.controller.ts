import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve a hello message' })
  @ApiResponse({ status: 200, description: 'Returns a hello message', type: String })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getHello(): Observable<string> {
    return this.appService.getHello();
  }

  @Get('/version')
  @ApiOperation({ summary: 'Retrieve the application version' })
  @ApiResponse({ status: 200, description: 'Returns the version of the application', type: String })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getVersion(): Observable<string> {
    return this.appService.getVersion();
  }
}
