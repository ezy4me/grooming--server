import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Client } from '@prisma/client';
import { ClientDto } from './dto';

@Injectable()
export class ClientService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllClients(): Promise<Client[]> {
    return this.databaseService.client.findMany({
      include: {
        user: true,
      },
    });
  }

  async getOneClientById(clientId: number): Promise<Client | null> {
    return this.databaseService.client.findUnique({
      where: { id: clientId },
      include: {
        user: true,
      },
    });
  }

  async getOneClientByUserId(userId: number): Promise<Client | null> {
    return this.databaseService.client.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async createClient(dto: ClientDto): Promise<Client> {
    return this.databaseService.client.create({
      data: {
        ...dto,
      },
    });
  }

  async updateClient(clientId: number, dto: ClientDto): Promise<Client> {
    return this.databaseService.client.update({
      where: { id: clientId },
      data: dto,
    });
  }

  async deleteClient(clientId: number): Promise<Client | null> {
    return this.databaseService.client.delete({
      where: { id: clientId },
    });
  }
}
