import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('signup')
  @Render('signup.hbs') // Render the "signup" view
  root() {
    return { message: 'Hello world!' };
  }
  @Get('signin')
  @Render('signin.hbs') // Render the "signin" view
  login() {
    return { message: 'Hello world!' };
  }
  @Get('verify-email')
  @Render('verify-email.hbs') // Render the "verify-email" view
  verifyMail() {
    return { message: 'Thank you for signing up. Please click the link in the email we sent you to verify your account.' };
  }

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    const token = await this.authService.signUp(dto); // Assuming authService.signUp() returns the token
    return { token };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Get('/verify/:id')
  @Render('verified.hbs')
  verifyUser(@Param('id') id: string) {
    return this.authService.verifyUser(id);
  }
}
