import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { InvalidRefreshToken } from 'src/exception/refresh-tokens.exceptions/InvalidStorageToken';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;
  justFORBUGS: string;
  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }
  //   When the application starts
  onApplicationBootstrap() {
    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
  }
  //   4 methods
  // Insert new entries into the redis db
  async insert(userID: string, tokenID: string): Promise<void> {
    // just like create -we are creating
    await this.redisClient.set(this.getKey(userID), tokenID);
  }

  // validate the token id passed in and return a boolean
  async validate(userID: string, tokenID: string): Promise<boolean> {
    const storedID = await this.redisClient.get(this.getKey(userID));
    if (storedID !== tokenID) {
      throw new InvalidRefreshToken();
    }
    return storedID === tokenID;
  }

  //   Invalidate the token by removing the id entry from db
  async invalidate(userID: string): Promise<void> {
    await this.redisClient.del(this.getKey(userID));
  }

  //   constructs the entryid based on the user id
  private getKey(userID: String): string {
    return `user-${userID}`;
  }
}
