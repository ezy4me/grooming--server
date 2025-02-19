import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ServiceModule } from './modules/service/service.module';
import { CategoryModule } from './modules/category/category.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, UserModule, AppointmentModule, ServiceModule, CategoryModule, EmployeeModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
