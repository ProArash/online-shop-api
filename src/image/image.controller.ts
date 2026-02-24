import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { UserRole } from '@/lib/user.role';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/roles.guard';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upload single image (Admin only)' })
  @ApiResponse({ status: 201, description: 'Image created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Post('bulk')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upload multiple images (Admin only)' })
  @ApiResponse({
    status: 201,
    description:
      'Images created successfully, returns array of image records with IDs',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createMany(@Body() createImageDtos: CreateImageDto[]) {
    return this.imageService.createMany(createImageDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({ status: 200, description: 'Return all images' })
  findAll() {
    return this.imageService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get images by product id' })
  @ApiResponse({ status: 200, description: 'Return images' })
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.imageService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by id' })
  @ApiResponse({ status: 200, description: 'Return image' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update image (Admin only)' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete image (Admin only)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
