import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { ImageService } from '@modules/image/image.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, ImageService],
})
export class AppointmentModule {}
