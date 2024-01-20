import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { throwError } from 'rxjs';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    // User Model
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(signUpDTO: SignUpDto) {
    try {
      const { email, password } = signUpDTO;

      const hashedPassword = await this.hashingService.hash(password);

      const newUser = await this.userModel.create({
        email: email,
        password: hashedPassword,
      });

      return newUser;
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
    const isPasswordCorrect = this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password not correct');
    }

    return user;
  }
}
