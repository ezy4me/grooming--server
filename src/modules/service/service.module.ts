import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ImageService } from '@modules/image/image.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ImageService],
})
export class ServiceModule {}
