import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
