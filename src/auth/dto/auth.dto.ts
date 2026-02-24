import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMobilePhone,
  Length,
} from 'class-validator';

export class MobileAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  device_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last_ip_address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_id?: string;
}
