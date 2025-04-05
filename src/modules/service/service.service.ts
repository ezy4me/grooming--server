import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Service } from '@prisma/client';
import { ServiceDto } from './dto/service.dto';
import { ImageService } from '@modules/image/image.service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly imageService: ImageService,
  ) {}

  async getAllServices(): Promise<Service[]> {
    return this.databaseService.service.findMany({
      include: {
        category: true,
      },
    });
  }

  async getServiceById(serviceId: number): Promise<Service | null> {
    return this.databaseService.service.findUnique({
      where: { id: serviceId },
    });
  }

  async getServiceByCategoryId(categoryId: number): Promise<Service[] | null> {
    return this.databaseService.service.findMany({
      where: { categoryId: categoryId },
    });
  }

  async createService(dto: ServiceDto): Promise<Service> {
    return this.databaseService.service.create({
      data: {
        ...dto,
        categoryId: Number(dto.categoryId),
        price: Number(dto.price),
      },
    });
  }

  async updateService(serviceId: number, dto: ServiceDto): Promise<Service> {
    return this.databaseService.service.update({
      where: { id: serviceId },
      data: {
        ...dto,
        categoryId: Number(dto.categoryId),
        price: Number(dto.price),
      },
    });
  }

  async deleteService(serviceId: number): Promise<Service | null> {
    return this.databaseService.service.delete({ where: { id: serviceId } });
  }
}
