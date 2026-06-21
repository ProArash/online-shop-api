import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductFeatureDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  soldCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Array of image IDs to add',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  imageIds?: number[];

  @ApiPropertyOptional({
    type: [Number],
    description: 'Array of image IDs to remove',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  removeImageIds?: number[];

  @ApiPropertyOptional({ type: [UpdateProductFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductFeatureDto)
  features?: UpdateProductFeatureDto[];
}
