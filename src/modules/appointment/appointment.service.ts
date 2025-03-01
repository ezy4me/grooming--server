import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Appointment } from '@prisma/client';
import { ImageService } from '@modules/image/image.service';
import { AppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly imageService: ImageService,
  ) {}

  async getAllAppointments(): Promise<Appointment[]> {
    return this.databaseService.appointment.findMany({
      include: {
        employee: true,
        clients: { include: { client: true } },
        services: { include: { service: true } },
        image: true,
      },
    });
  }

  async getAppointmentById(appointmentId: number): Promise<Appointment | null> {
    const appointment = await this.databaseService.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        employee: true,
        clients: { include: { client: true } },
        services: { include: { service: true } },
        image: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    return appointment;
  }

  async createAppointment(
    dto: AppointmentDto,
    file?: Express.Multer.File,
  ): Promise<Appointment> {
    let imageId;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.appointment.create({
      data: {
        date: new Date(dto.date),
        status: dto.status,
        employeeId: dto.employeeId,
        imageId: imageId,
        clients: {
          create: dto.clientIds.map((clientId) => ({
            client: { connect: { id: clientId } },
          })),
        },
        services: {
          create: dto.serviceIds.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
    });
  }

  async updateAppointment(
    appointmentId: number,
    dto: AppointmentDto,
    file?: Express.Multer.File,
  ): Promise<Appointment> {
    let imageId;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id;
    }

    return this.databaseService.appointment.update({
      where: { id: appointmentId },
      data: {
        date: new Date(dto.date),
        status: dto.status,
        employeeId: dto.employeeId,
        imageId: imageId,
        clients: {
          set: dto.clientIds.map((clientId) => ({ id: clientId })),
        },
        services: {
          set: dto.serviceIds.map((serviceId) => ({ id: serviceId })),
        },
      },
    });
  }

  async deleteAppointment(appointmentId: number): Promise<Appointment | null> {
    return this.databaseService.appointment.delete({
      where: { id: appointmentId },
    });
  }

  async getImageByAppointmentId(
    appointmentId: number,
  ): Promise<{ buffer: Buffer; type: string }> {
    const appointment = await this.databaseService.appointment.findUnique({
      where: { id: appointmentId },
      select: { imageId: true },
    });

    if (!appointment?.imageId) {
      throw new NotFoundException(
        `Image for appointment with ID ${appointmentId} not found`,
      );
    }

    const image = await this.imageService.getImageById(appointment.imageId);

    if (!image || !image.buffer) {
      throw new NotFoundException(
        `Image not found for appointment ${appointmentId}`,
      );
    }

    return image;
  }
}
