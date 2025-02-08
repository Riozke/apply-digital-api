import { Injectable } from '@nestjs/common';
import * as packageJson from '../package.json';
import { Observable, of } from 'rxjs';

@Injectable()
export class AppService {
  getHello(): Observable<string> {
    return of('Hello World!');
  }

  getVersion(): Observable<string> {
    return of(packageJson.version);
  }
}
