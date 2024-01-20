import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, coffeeSchema } from './entities/coffee.entity/coffee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coffee.name, schema: coffeeSchema }]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
