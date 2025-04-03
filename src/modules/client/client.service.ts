import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Client } from '@prisma/client';
import { ClientDto } from './dto';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  WidthType,
} from 'docx';

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

  async generateReport(clientId: number): Promise<Buffer> {
    const client = await this.databaseService.client.findUnique({
      where: { id: clientId },
      include: {
        Appointment: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
            employee: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }

    const createTableRow = (appointment) => {
      const services = appointment.services
        .map((s) => s.service.name)
        .join(', ');
      const totalPrice =
        appointment.services
          .reduce((sum, service) => sum + service.service.price, 0)
          .toFixed(2) + ' ₽';

      // Форматирование даты и времени
      const formattedDate = appointment.date
        .toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', ''); // Убираем запятую между датой и временем

      return new TableRow({
        children: [
          new TableCell({
            children: [this.createTextParagraph(formattedDate)],
          }),
          new TableCell({
            children: [this.createTextParagraph(appointment.employee.fullName)],
          }),
          new TableCell({ children: [this.createTextParagraph(services)] }),
          new TableCell({ children: [this.createTextParagraph(totalPrice)] }),
        ],
      });
    };

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Отчет по записям клиента ${client.name}`,
                  bold: true,
                  font: 'Arial',
                  size: 36,
                  color: '000000',
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400, line: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Клиент: ${client.name}`,
                  font: 'Arial',
                  size: 28,
                  bold: true,
                  color: '000000',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Записи клиента:',
                  font: 'Arial',
                  size: 26,
                  bold: true,
                  color: '000000',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    this.createTableHeader('Дата'),
                    this.createTableHeader('Работник'),
                    this.createTableHeader('Услуга'),
                    this.createTableHeader('Стоимость'),
                  ],
                }),
                ...client.Appointment.map(createTableRow),
              ],
            }),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }

  private createTextParagraph(text: string) {
    return new Paragraph({
      children: [new TextRun({ text, font: 'Arial', size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200, line: 200 },
    });
  }

  private createTableHeader(text: string) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({ text, font: 'Arial', size: 24, color: '000000' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200, line: 200 },
        }),
      ],
      width: { size: 24, type: WidthType.PERCENTAGE },
    });
  }
}
