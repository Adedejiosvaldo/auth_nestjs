import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { RefreshTokenIdsStorage } from './authentication/dto/refresh-token-ids.storage/refresh-token-ids.storage';
import { RolesGuard } from './authorization/guards/roles/roles.guard';
import { ApiKeysService } from './authentication/api-keys.service';
import {
  ApiKey,
  ApiKeySchema,
} from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { ApiKeyGuard } from './authentication/guards/api-key/api-key.guard';
import { ApiKeyController } from './api-key/api-key.controller';
import { ApiKeyService } from './api-key/generate-apikey.service';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthenticationService } from './authentication/social/goole-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/goole-authentication.controller';
import { OtpAuthService } from './authentication/otp/otp-auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: ApiKey.name, schema: ApiKeySchema },
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],

  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthenticationService,
    // AuthenticationGuard
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    AccessTokenGuard,
    RefreshTokenIdsStorage,
    ApiKeysService,
    ApiKeyService,
    ApiKeyGuard,
    UsersService,
    GoogleAuthenticationService,
    OtpAuthService,
  ],

  controllers: [
    AuthenticationController,
    ApiKeyController,
    GoogleAuthenticationController,
  ],
})
export class IamModule {}
