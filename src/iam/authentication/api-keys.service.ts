import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GeneratedAPIKeyPayload } from '../entity/GeneratedAPIKeyPayload.entity';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly hasingService: HashingService) {}
  async createAndHash(id: string): Promise<GeneratedAPIKeyPayload> {
    const apiKey = this.generateAPIKey(id);
    const hashedKey = await this.hasingService.hash(apiKey);
    return { apiKey, hashedKey };
  }

  async validate(
    apiKeyFromHeader: string,
    hashedKey: string,
  ): Promise<boolean> {
    try {
      return this.hasingService.compare(apiKeyFromHeader, hashedKey);
    } catch (error) {
      throw new UnauthorizedException('Invalid API key');
    }
  }

  extractIDFromAPIKey(apiKey: string): string {
    try {
      const decodedApiKey = Buffer.from(apiKey, 'base64').toString('ascii');
      const [id] = decodedApiKey.split(' ');
      return id;
    } catch (error) {
      throw new UnauthorizedException('Invalid API key format');
    }
  }

  private generateAPIKey(id: string): string {
    const apiKey = `${id} ${randomUUID()}`;
    const bufferedCode = Buffer.from(apiKey).toString('base64');
    return bufferedCode;
  }
}
