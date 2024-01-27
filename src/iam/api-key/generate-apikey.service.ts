import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { ApiKeysService } from '../authentication/api-keys.service';
import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { Model } from 'mongoose';
import { APIKeyDTO } from './dto/apikey.dto';
import { UsersService } from 'src/users/users.service';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apikeyService: ApiKeysService,
    private readonly userService: UsersService,

    @InjectModel(ApiKey.name) private readonly apiModel: Model<ApiKey>,
  ) {}

  //   @UseFilters(MongooseDuplicateExceptionFilter)
  async createAndSaveApiKey(body: APIKeyDTO) {
    try {
      const { userid } = body;

      const user = await this.userService.findOne(userid);

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      const apiKeyPayload = await this.apikeyService.createAndHash(userid);

      const savedApiKey = await this.apiModel.create({
        user: userid,
        key: apiKeyPayload.hashedKey,
      });

      return { apikey: apiKeyPayload.apiKey };
    } catch (error) {
      const UniqueViolationErrorCode = '11000';

      if (error.code === 11000) {
        throw new ConflictException(
          'User has already been assigned to an apikey',
        );
      }
      // Handle errors appropriately (e.g., log, throw specific errors)
      console.error('Error creating API key:', error);
      throw new InternalServerErrorException('Failed to create API key');
    }
  }
}
