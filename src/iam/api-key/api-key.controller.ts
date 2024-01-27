import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { ApiKeyService } from './generate-apikey.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { AuthType } from '../authentication/enums/auth.type.enums';
import { APIKeyDTO } from './dto/apikey.dto';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Auth(AuthType.None)
  //   @UseFilters(MongooseDuplicateExceptionFilter)
  @Post()
  createApiKey(@Body() body: APIKeyDTO) {
    return this.apiKeyService.createAndSaveApiKey(body);
  }
}
