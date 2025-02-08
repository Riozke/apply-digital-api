import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { AuthModule } from '../authentication/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        AuthModule,
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule { }
