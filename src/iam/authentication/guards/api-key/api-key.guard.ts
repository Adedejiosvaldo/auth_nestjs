import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ApiKeysService } from '../../api-keys.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { User } from 'src/users/entities/user.entity';
import { REQUEST_USER_KEY } from 'src/iam/constants';
import { ActiveUserData } from 'src/iam/interfaces/jwt.dto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeysService,
    @InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyFromHeader = this.extracyKeyFromHeader(request);

    if (!apiKeyFromHeader) {
      throw new UnauthorizedException('No API-Key Present');
    }

    try {
      const apiKeyEntityID =
        this.apiKeyService.extractIDFromAPIKey(apiKeyFromHeader);

      const apiEntity = await this.apiKeyModel
        .findOne({ user: apiKeyEntityID })
        .populate({ path: 'user', select: '-password' });

      await this.apiKeyService.validate(apiKeyFromHeader, apiEntity.key);

      request[REQUEST_USER_KEY] = {
        sub: apiEntity.user._id,
        email: apiEntity.user.email,
        role: apiEntity.user.role,
      } as ActiveUserData;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        console.log('Error During API key Validation');
        throw new UnauthorizedException('Invalid API Key');
      }
    }
    return true;
  }
  private extracyKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];

    return type === 'ApiKey' ? key : undefined;
  }
}
