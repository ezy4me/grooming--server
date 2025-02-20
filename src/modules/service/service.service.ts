import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.databaseService.service.findMany();
  }

  async getServiceById(serviceId: number): Promise<Service | null> {
    return this.databaseService.service.findUnique({
      where: { id: serviceId },
    });
  }

  async createService(
    dto: ServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    let imageId;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.service.create({
      data: {
        ...dto,
        categoryId: Number(dto.categoryId),
        price: Number(dto.price),
        imageId: imageId,
      },
    });
  }

  async updateService(
    serviceId: number,
    dto: ServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    let imageId;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.service.update({
      where: { id: serviceId },
      data: {
        ...dto,
        categoryId: Number(dto.categoryId),
        price: Number(dto.price),
        imageId: imageId,
      },
    });
  }

  async deleteService(serviceId: number): Promise<Service | null> {
    return this.databaseService.service.delete({ where: { id: serviceId } });
  }

  async getImageByServiceId(
    serviceId: number,
  ): Promise<{ buffer: Buffer; type: string }> {
    const service = await this.databaseService.service.findUnique({
      where: { id: serviceId },
      select: { imageId: true },
    });

    if (!service?.imageId) {
      throw new NotFoundException(
        `Image for service with ID ${serviceId} not found`,
      );
    }

    return this.imageService.getImageById(service.imageId);
  }
}
