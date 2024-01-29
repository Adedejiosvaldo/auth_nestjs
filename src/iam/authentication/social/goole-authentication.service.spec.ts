import { Test, TestingModule } from '@nestjs/testing';
import { GooleAuthenticationService } from './goole-authentication.service';

describe('GooleAuthenticationService', () => {
  let service: GooleAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooleAuthenticationService],
    }).compile();

    service = module.get<GooleAuthenticationService>(GooleAuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
