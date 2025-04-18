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
import { AppointmentService } from './appointment.service';
import { Appointment } from '@prisma/client';
import { AppointmentDto } from './dto/appointment.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointments();
  }

  @Get(':id')
  async getAppointmentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment | null> {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get('client/:clientId')
  async getAppointmentsByClientId(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByClientId(clientId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AppointmentDto })
  async createAppointment(
    @UploadedFile() file: Express.Multer.File,
    @Body() appointmentDto: AppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(appointmentDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AppointmentDto })
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() appointmentDto: AppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointment(id, appointmentDto);
  }

  @Delete(':id')
  async deleteAppointment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment | null> {
    return this.appointmentService.deleteAppointment(id);
  }

  @Post('available-slots')
  async getAvailableSlots(
    @Body() availableSlotsRequest: any,
  ): Promise<string[]> {
    const { date, employeeId } = availableSlotsRequest;
    return this.appointmentService.getAvailableSlots(date, employeeId);
  }
}
