import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { throwError } from 'rxjs';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/jwt.dto';
import { RefreshTokenDTO } from './dto/refresh-token/refresh-token.dto';
import { ObjectId } from 'mongodb';
import { RefreshTokenIdsStorage } from './dto/refresh-token-ids.storage/refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { InvalidRefreshToken } from 'src/exception/refresh-tokens.exceptions/InvalidStorageToken';

@Injectable()
export class AuthenticationService {
  constructor(
    // User Model
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenStorage: RefreshTokenIdsStorage,

    // Injecting config
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDTO: SignUpDto) {
    try {
      const { email, password } = signUpDTO;

      const hashedPassword = await this.hashingService.hash(password);

      const newUser = await this.userModel.create({
        email: email,
        password: hashedPassword,
      });

      const accessToken = await this.jwtService.signAsync(
        { sub: newUser._id, email: newUser.email },
        {
          issuer: this.jwtConfiguration.issuer,
          audience: this.jwtConfiguration.audience,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTTL,
        },
      );

      return { accessToken, data: newUser };
    } catch (error) {
      const puUniqueViolationErrorCode = '23505';

      if (error.code === puUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async Login(signinDTO: SignInDto) {
    const { email, password } = signinDTO;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const isPasswordCorrect = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password not correct');
    }
    // Partial makes all the properties in the active data interface - optional
    return await this.generateToken(user);
  }

  public async generateToken(user: User) {
    // generate random token refresh ID
    const refreshTokenID = randomUUID();
    console.log(refreshTokenID);

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user._id,
        this.jwtConfiguration.accessTokenTTL,
        { email: user.email, role: user.role },
      ),
      this.signToken(user._id, this.jwtConfiguration.refreshTokenTTL, {
        refreshTokenID,
      }),
    ]);

    // console.log(refreshTokenID),
    await this.refreshTokenStorage.insert(user._id, refreshTokenID);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokensDTO: RefreshTokenDTO) {
    try {
      const { sub, refreshTokenID } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenID: string }
      >(refreshTokensDTO.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userModel.findById(sub);
      // Validate token
      const isValid = await this.refreshTokenStorage.validate(
        user._id,
        refreshTokenID,
      );
      // Refresh token rotation
      if (isValid) {
        await this.refreshTokenStorage.invalidate(user._id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateToken(user);
      // return this.authService.Login(body);
    } catch (error) {
      if (error instanceof InvalidRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
