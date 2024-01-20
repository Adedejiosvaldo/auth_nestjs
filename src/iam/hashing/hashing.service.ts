import { Injectable } from '@nestjs/common';

@Injectable()
// Acting as an interface for service action extraction
export abstract class HashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
