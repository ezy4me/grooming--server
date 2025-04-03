import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  Res,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from '@prisma/client';
import { ClientDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Get()
  async getAllClients(): Promise<Client[]> {
    return this.clientService.getAllClients();
  }

  @Public()
  @Get(':clientId')
  async getOneClientById(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Client | null> {
    return this.clientService.getOneClientById(clientId);
  }

  @Get('/user/:userId')
  async getOneClientByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Client | null> {
    return this.clientService.getOneClientByUserId(userId);
  }

  @Post()
  async createClient(@Body() clientDto: ClientDto): Promise<Client> {
    return this.clientService.createClient(clientDto);
  }

  @Put(':clientId')
  async updateClient(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() clientDto: ClientDto,
  ): Promise<Client> {
    return this.clientService.updateClient(clientId, clientDto);
  }

  @Delete(':clientId')
  async deleteClient(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Client | null> {
    return this.clientService.deleteClient(clientId);
  }

  @Public()
  @Get(':clientId/appointment/report')
  async generateReport(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.clientService.generateReport(clientId);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transaction_${clientId}.docx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    res.send(buffer);
  }
}
