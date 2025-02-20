import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Res,
  Body,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: 'multipart/form-data' })
  async uploadImage(
    @UploadedFile() file: any,
    @Body('name') name: string,
    @Body('type') type: string,
  ): Promise<Partial<Image>> {
    return this.imageService.uploadImage(file, name, type);
  }

  @Get(':id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.imageService.getImageById(id);
    res.set({
      'Content-Type': image.type,
      'Content-Disposition': `inline; filename="${id}"`,
    });
    res.send(image.buffer);
  }

  @Delete(':id')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Partial<Image>> {
    return this.imageService.deleteImage(id);
  }
}
