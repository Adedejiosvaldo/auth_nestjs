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

@Injectable()
export class AuthenticationService {
  constructor(
    // User Model
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,

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
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user._id,
        this.jwtConfiguration.accessTokenTTL,
        { email: user.email },
      ),
      this.signToken(user._id, this.jwtConfiguration.refreshTokenTTL),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokensDTO: RefreshTokenDTO) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokensDTO.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userModel.findById(sub).exec();

      return this.generateToken(user);
      // return this.authService.Login(body);
    } catch (error) {
      throw new UnauthorizedException('Refresh token');
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
