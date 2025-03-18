import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, IsArray } from 'class-validator';

export class AppointmentDto {
  @ApiProperty({ example: '2025-03-15T14:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'confirmed' })
  @IsString()
  status: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  employeeId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  clientId: number;

  @ApiProperty({ example: [3, 4] })
  @IsArray()
  @IsInt({ each: true })
  serviceIds: number[];
}
