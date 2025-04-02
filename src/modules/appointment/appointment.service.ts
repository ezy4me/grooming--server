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
        client: true,
        services: { include: { service: true } },
        image: true,
      },
    });
  }

  async getAppointmentsByClientId(clientId: number): Promise<Appointment[]> {
    return this.databaseService.appointment.findMany({
      where: { clientId },
      include: {
        employee: true,
        client: true,
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
        client: true,
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
    let imageId: number | null = null;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id!;
    }

    const appointment = await this.databaseService.appointment.create({
      data: {
        date: new Date(dto.date),
        status: dto.status,
        employeeId: dto.employeeId,
        clientId: dto.clientId,
        imageId: imageId,
      },
    });

    await this.databaseService.appointmentService.createMany({
      data: dto.serviceIds.map((serviceId) => ({
        appointmentId: appointment.id,
        serviceId: serviceId,
      })),
    });

    const createdAppointment =
      await this.databaseService.appointment.findUnique({
        where: { id: appointment.id },
        include: {
          employee: true,
          client: true,
          services: { include: { service: true } },
          image: true,
        },
      });

    if (!createdAppointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointment.id} not found`,
      );
    }

    return createdAppointment;
  }

  async updateAppointment(
    appointmentId: number,
    dto: AppointmentDto,
    file?: Express.Multer.File,
  ): Promise<Appointment> {
    let imageId: number | null = null;

    if (file) {
      const image = await this.imageService.uploadImage(
        file,
        file.originalname,
        file.mimetype,
      );
      imageId = image.id!;
    }

    await this.databaseService.appointmentService.deleteMany({
      where: { appointmentId },
    });

    await this.databaseService.appointmentService.createMany({
      data: dto.serviceIds.map((serviceId) => ({
        appointmentId: appointmentId,
        serviceId: serviceId,
      })),
    });

    return this.databaseService.appointment.update({
      where: { id: appointmentId },
      data: {
        date: new Date(dto.date),
        status: dto.status,
        employeeId: dto.employeeId,
        clientId: dto.clientId,
        imageId: imageId,
      },
      include: {
        employee: true,
        client: true,
        services: { include: { service: true } },
        image: true,
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
