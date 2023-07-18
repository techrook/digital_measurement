import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { UserDto, resetPWDDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('brandname')
  brandName(@GetUser('id') userId: number, @Body() dto: UserDto) {
    return this.userService.brandName(userId, dto);
  }
  @Patch('changepassword')
  changePassword(
    @GetUser('id') userId: number,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.changePassword(userId, newPassword, oldPassword);
  }
  @Delete('delete')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
  @Post('forgotpassword')
  forgotPassword(@Body() dto: resetPWDDto) {
    return this.userService.forgotPassword(dto);
  }
  @Get('/resetpassword/:token')
  resetPassword(@Param('token') token: string) {
    return this.userService.resetPassword(token);
  }
  @Patch('/updatepassword/:id')
  updatedResetPassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    return this.userService.updatedResetPassword(id, password);
  }
}
