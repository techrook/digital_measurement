import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe()) dto: AuthDto) {
    return this.authService.signUp(dto); // Assuming authService.signUp() returns the token
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body(new ValidationPipe()) dto: AuthDto) {
    return this.authService.signIn(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/verify/:id')
  verifyUser(@Param('id') id: string) {
    return this.authService.verifyUser(id);
  }
}
