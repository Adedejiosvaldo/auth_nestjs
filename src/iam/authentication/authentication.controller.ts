import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { Response, response } from 'express';
// import { Auth } from './decorators/public.decorator';
import { AuthType } from './enums/auth.type.enums';
import { Public } from './decorators/public.decorator';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';
import { RefreshTokenDTO } from './dto/refresh-token/refresh-token.dto';

// @Auth(AuthType.None)
@Public()
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseFilters(MongooseDuplicateExceptionFilter)
  @Post('createAccount')
  createAnAccount(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
  // Tells the server to respond with a 200 status code
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // const accessTokens = await this.authService.Login(body);
    // response.cookie('accessToken', accessTokens, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });

    return this.authService.Login(body);
  }

  // Tells the server to respond with a 200 status code
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshToken: RefreshTokenDTO) {
    return this.authService.refreshTokens(refreshToken);
  }
}
