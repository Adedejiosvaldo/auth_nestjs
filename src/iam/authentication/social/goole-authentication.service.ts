import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '../authentication.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
// OnModuleInit - Carries out some operations when the module initializes
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  //   Injected services
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  onModuleInit() {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientID, clientSecret);
  }
  async authenticate(token: string) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
      });

      const { email, sub: googleId } = loginTicket.getPayload();
      const user = await this.userModel.findOne({ googleID: googleId });

      if (user) {
        return this.authService.generateToken(user);
      } else {
        const newUser = await this.userModel.create({
          email,
          googleID: googleId,
        });
        return this.authService.generateToken(newUser);
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exist');
      }
      throw new UnauthorizedException('Login failed-Not authorized');
    }
  }
}
