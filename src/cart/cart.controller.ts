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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CurrentUser } from '@/lib/user.payload';
import { UserRole } from '@/lib/user.role';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';

@ApiTags('cart')
@Controller('cart')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all carts (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all carts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get('my-cart')
  @ApiOperation({ summary: 'Get current user active cart' })
  @ApiResponse({ status: 200, description: 'Return active cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyCart(@CurrentUser('sub') userId: number) {
    return this.cartService.getOrCreateActiveCart(userId);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get carts by user id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return carts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by id' })
  @ApiResponse({ status: 200, description: 'Return cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart by id' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete cart by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItem(id, addToCartDto);
  }

  @Post('my-cart/items')
  @ApiOperation({ summary: 'Add item to my cart' })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addItemToMyCart(
    @CurrentUser('sub') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.addItem(cart.id, addToCartDto);
  }

  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(id, productId);
  }

  @Delete('my-cart/items/:productId')
  @ApiOperation({ summary: 'Remove item from my cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async removeItemFromMyCart(
    @CurrentUser('sub') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.removeItem(cart.id, productId);
  }

  @Patch(':id/items/:productId/quantity/:quantity')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ status: 200, description: 'Quantity updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  updateItemQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateItemQuantity(id, productId, quantity);
  }

  @Patch('my-cart/items/:productId/quantity/:quantity')
  @ApiOperation({ summary: 'Update item quantity in my cart' })
  @ApiResponse({ status: 200, description: 'Quantity updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async updateMyCartItemQuantity(
    @CurrentUser('sub') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('quantity', ParseIntPipe) quantity: number,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.updateItemQuantity(cart.id, productId, quantity);
  }

  @Delete(':id/clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  clearCart(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.clearCart(id);
  }

  @Delete('my-cart/clear')
  @ApiOperation({ summary: 'Clear my cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async clearMyCart(@CurrentUser('sub') userId: number) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.clearCart(cart.id);
  }

  @Post(':id/coupon/:couponCode')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  applyCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Param('couponCode') couponCode: string,
  ) {
    return this.cartService.applyCoupon(id, couponCode);
  }

  @Post('my-cart/coupon/:couponCode')
  @ApiOperation({ summary: 'Apply coupon to my cart' })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async applyMyCoupon(
    @CurrentUser('sub') userId: number,
    @Param('couponCode') couponCode: string,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.applyCoupon(cart.id, couponCode);
  }

  @Delete(':id/coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  @ApiResponse({ status: 200, description: 'Coupon removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  removeCoupon(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeCoupon(id);
  }

  @Delete('my-cart/coupon')
  @ApiOperation({ summary: 'Remove coupon from my cart' })
  @ApiResponse({ status: 200, description: 'Coupon removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeMyCoupon(@CurrentUser('sub') userId: number) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.removeCoupon(cart.id);
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Checkout cart' })
  @ApiResponse({ status: 200, description: 'Checkout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  checkout(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.checkout(id);
  }

  @Post('my-cart/checkout')
  @ApiOperation({ summary: 'Checkout my cart' })
  @ApiResponse({ status: 200, description: 'Checkout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  async checkoutMyCart(@CurrentUser('sub') userId: number) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.checkout(cart.id);
  }
}
