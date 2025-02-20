import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServiceService } from './service.service';
import { Service } from '@prisma/client';
import { ServiceDto } from './dto/service.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '@common/decorators';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getAllServices(): Promise<Omit<Service, 'image'>[]> {
    return this.serviceService.getAllServices();
  }

  @Get(':id')
  async getServiceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Service | null> {
    return this.serviceService.getServiceById(id);
  }

  @Public()
  @Get(':id/image')
  async getImageByServiceId(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.serviceService.getImageByServiceId(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    res.set({
      'Content-Type': image.type,
      'Content-Disposition': `inline; filename="image-${id}.jpg"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Content-Length': image.buffer.length.toString(),
    });

    res.end(image.buffer);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ServiceDto })
  async createService(
    @UploadedFile() file: Express.Multer.File,
    @Body() serviceDto: ServiceDto,
  ): Promise<Service> {
    return this.serviceService.createService(serviceDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ServiceDto })
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() serviceDto: ServiceDto,
  ): Promise<Service> {
    return this.serviceService.updateService(id, serviceDto, file);
  }

  @Delete(':id')
  async deleteService(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Service | null> {
    return this.serviceService.deleteService(id);
  }
}
