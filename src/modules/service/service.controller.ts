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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServiceService } from './service.service';
import { Service } from '@prisma/client';
import { ServiceDto } from './dto/service.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Public()
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
  @Get('/category/:categoryId')
  async getServiceByCategoryId(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Service[] | null> {
    return this.serviceService.getServiceByCategoryId(categoryId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ServiceDto })
  async createService(
    @UploadedFile() file: Express.Multer.File,
    @Body() serviceDto: ServiceDto,
  ): Promise<Service> {
    return this.serviceService.createService(serviceDto);
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
    return this.serviceService.updateService(id, serviceDto);
  }

  @Delete(':id')
  async deleteService(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Service | null> {
    return this.serviceService.deleteService(id);
  }
}
