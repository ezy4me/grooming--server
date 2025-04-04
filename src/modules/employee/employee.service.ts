import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Employee } from '@prisma/client';
import { EmployeeDto } from './dto/employee.dto';
import { ImageService } from '@modules/image/image.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly imageService: ImageService,
  ) {}

  async getAllEmployees(): Promise<Employee[]> {
    return this.databaseService.employee.findMany({
      include: {
        user: true,
      },
    });
  }

  async getEmployeeById(employeeId: number): Promise<Employee | null> {
    return this.databaseService.employee.findUnique({
      where: { id: employeeId },
    });
  }

  async getEmployeeByUserId(userId: number): Promise<Employee | null> {
    return this.databaseService.employee.findUnique({
      where: { userId: Number(userId) },
    });
  }

  async createEmployee(
    dto: EmployeeDto,
    file?: Express.Multer.File,
  ): Promise<Employee> {
    let imageId;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.employee.create({
      data: {
        ...dto,
        userId: Number(dto.userId),
        imageId: imageId,
      },
    });
  }

  async updateEmployee(
    employeeId: number,
    dto: EmployeeDto,
    file?: Express.Multer.File,
  ): Promise<Employee> {
    let imageId;
    console.log({ ...dto });

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.employee.update({
      where: { id: employeeId },
      data: {
        ...dto,
        userId: Number(dto.userId),
        imageId: imageId,
      },
    });
  }

  async deleteEmployee(employeeId: number): Promise<Employee | null> {
    return this.databaseService.employee.delete({ where: { id: employeeId } });
  }

  async getImageByEmployeeId(
    employeeId: number,
  ): Promise<{ buffer: Buffer; type: string }> {
    const employee = await this.databaseService.employee.findUnique({
      where: { id: employeeId },
      select: { imageId: true },
    });

    if (!employee?.imageId) {
      throw new NotFoundException(
        `Image for employee with ID ${employeeId} not found`,
      );
    }

    return this.imageService.getImageById(employee.imageId);
  }

  async getEmployeeCalendar(employeeId: number, start: string, end: string) {
    return this.databaseService.appointment.findMany({
      where: {
        employeeId,
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
