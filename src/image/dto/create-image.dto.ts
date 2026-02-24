import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;
}
