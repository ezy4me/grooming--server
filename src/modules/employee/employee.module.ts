import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { ImageService } from '@modules/image/image.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, ImageService],
})
export class EmployeeModule {}
