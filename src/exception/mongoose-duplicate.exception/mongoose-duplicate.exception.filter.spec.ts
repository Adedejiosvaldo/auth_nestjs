import { MongooseDuplicateExceptionFilter } from './mongoose-duplicate.exception.filter';

describe('MongooseDuplicateExceptionFilter', () => {
  it('should be defined', () => {
    expect(new MongooseDuplicateExceptionFilter()).toBeDefined();
  });
});
