import { Test, TestingModule } from '@nestjs/testing';
import { GooleAuthenticationController } from './goole-authentication.controller';

describe('GooleAuthenticationController', () => {
  let controller: GooleAuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooleAuthenticationController],
    }).compile();

    controller = module.get<GooleAuthenticationController>(GooleAuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
