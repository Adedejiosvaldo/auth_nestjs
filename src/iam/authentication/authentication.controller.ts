import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('createAccount')
  createAnAccount(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  // Tells the server to respond with a 200 status code
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: SignInDto) {
    return this.authService.Login(body);
  }
}
