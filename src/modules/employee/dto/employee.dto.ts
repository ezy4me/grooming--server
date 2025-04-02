import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class EmployeeDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  imageId?: number;

  @ApiProperty()
  @IsOptional()
  image?: any;

  @ApiProperty()
  @IsString()
  birthday: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  userId: number;
}
