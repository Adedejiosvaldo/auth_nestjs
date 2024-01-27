import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, coffeeSchema } from './entities/coffee.entity/coffee.entity';
import { APP_FILTER } from '@nestjs/core';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';
import { ApiKeyGuard } from 'src/iam/authentication/guards/api-key/api-key.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coffee.name, schema: coffeeSchema }]),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,

    // { provide: APP_FILTER, useClass: MongooseDuplicateExceptionFilter },
  ],
})
export class CoffeesModule {}
