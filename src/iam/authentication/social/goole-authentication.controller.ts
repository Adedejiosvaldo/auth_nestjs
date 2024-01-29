import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './goole-authentication.service';
import { GoogleDTO } from './dto/Google.dto';

@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleSigninService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() tokenDTo: GoogleDTO) {
    return this.googleSigninService.authenticate(tokenDTo.token);
  }
}
