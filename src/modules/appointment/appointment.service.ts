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
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    return appointment;
  }

  async createAppointment(dto: AppointmentDto): Promise<Appointment> {
    const appointment = await this.databaseService.appointment.create({
      data: {
        date: new Date(dto.date),
        status: dto.status,
        employeeId: dto.employeeId,
        clientId: dto.clientId,
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
  ): Promise<Appointment> {
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
      },
      include: {
        employee: true,
        client: true,
        services: { include: { service: true } },
      },
    });
  }

  async deleteAppointment(appointmentId: number): Promise<Appointment | null> {
    return this.databaseService.appointment.delete({
      where: { id: appointmentId },
    });
  }

  async getAvailableSlots(date: string, employeeId: number): Promise<string[]> {
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(21, 0, 0, 0);

    const appointments = await this.databaseService.appointment.findMany({
      where: {
        employeeId: Number(employeeId),
        date: {
          gte: startTime,
          lte: endTime,
        },
      },
    });

    const availableSlots: string[] = [];

    const isSlotAvailable = (slotTime: Date): boolean => {
      return !appointments.some((appointment) => {
        const appointmentStart = new Date(appointment.date);
        const appointmentEnd = new Date(appointment.date);
        appointmentEnd.setMinutes(appointmentStart.getMinutes() + 30);

        appointmentStart.setHours(appointmentStart.getHours() - 3);
        appointmentEnd.setHours(appointmentEnd.getHours() - 3);

        return (
          (slotTime >= appointmentStart && slotTime < appointmentEnd) ||
          (slotTime.getTime() + 30 * 60000 > appointmentStart.getTime() &&
            slotTime.getTime() < appointmentEnd.getTime())
        );
      });
    };

    for (
      let currentTime = startTime;
      currentTime < endTime;
      currentTime.setMinutes(currentTime.getMinutes() + 30)
    ) {
      const slot = new Date(currentTime);

      slot.setHours(slot.getHours());

      if (isSlotAvailable(slot)) {
        availableSlots.push(slot.toLocaleTimeString());
      }
    }

    return availableSlots;
  }
}
