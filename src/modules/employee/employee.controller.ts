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
import { EmployeeService } from './employee.service';
import { Employee } from '@prisma/client';
import { EmployeeDto } from './dto/employee.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '@common/decorators';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getAllEmployees(): Promise<Omit<Employee, 'image'>[]> {
    return this.employeeService.getAllEmployees();
  }

  @Get(':id')
  async getEmployeeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Employee | null> {
    return this.employeeService.getEmployeeById(id);
  }

  @Get('/user/:userId')
  async getEmployeeByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Employee | null> {
    return this.employeeService.getEmployeeByUserId(userId);
  }

  @Public()
  @Get(':id/image')
  async getImageByEmployeeId(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.employeeService.getImageByEmployeeId(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Убираем кэширование
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
  @ApiBody({ type: EmployeeDto })
  async createEmployee(
    @UploadedFile() file: Express.Multer.File,
    @Body() employeeDto: EmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(employeeDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: EmployeeDto })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() employeeDto: EmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateEmployee(id, employeeDto, file);
  }

  @Delete(':id')
  async deleteEmployee(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Employee | null> {
    return this.employeeService.deleteEmployee(id);
  }
}
