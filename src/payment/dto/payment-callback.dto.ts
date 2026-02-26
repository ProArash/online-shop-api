import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentCallbackDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  success?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;
}
