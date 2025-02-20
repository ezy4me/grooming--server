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
import { DatabaseService } from './database/database.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './modules/image/image.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AppointmentModule,
    ServiceModule,
    CategoryModule,
    EmployeeModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ImageModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
