import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async uploadImage(
    file: Express.Multer.File,
    name: string,
    type: string,
  ): Promise<Partial<Image>> {
    return await this.databaseService.image.create({
      data: {
        name: name,
        type: type,
        buffer: file.buffer,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async getImageById(id: number): Promise<any> {
    const image = await this.databaseService.image.findUnique({
      where: { id },
      select: {
        buffer: true,
        type: true,
      },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    console.log(image);

    return image;
  }

  async deleteImage(id: number): Promise<Partial<Image>> {
    return await this.databaseService.image.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }
}
