import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OtpAuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    // generate uri
    const uri = authenticator.keyuri(email, appName, secret);
    return { uri, secret };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(email: string, secret: string) {
    await this.userModel.findOneAndUpdate(
      { email },
      { tfaSecret: secret, isTfaEnable: true },
    );
  }
}
