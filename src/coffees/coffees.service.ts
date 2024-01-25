import { Catch, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coffee } from './entities/coffee.entity/coffee.entity';
import { Model } from 'mongoose';
import { CreateCoffeeDTO } from './dto/create-coffee.entity/create-coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
  ) {}

  async getAllCoffees() {
    return this.coffeeModel.find();
  }

  async getACoffee(id: string) {
    const coffee = await this.coffeeModel.findById(id);

    if (!coffee) {
      throw new NotFoundException(`Coffee of id ${id} does not exist`);
    }
    return coffee;
  }

  //   @Catch(MongooseDuplicateExceptionFilter)

  async createCoffee(body: CreateCoffeeDTO) {
    const { name, brand, flavors } = body;
    const coffee = await this.coffeeModel.create({ name, brand, flavors });
    console.log(coffee);
    return coffee;
  }

  async updateCoffee(id: string, updatedBody: UpdateCoffeeDto) {
    const coffee = await this.coffeeModel.findByIdAndUpdate(
      id,
      { ...updatedBody },
      {
        new: true,
      },
    );

    if (!coffee) {
      throw new NotFoundException('Nope, Not Found');
    }

    return coffee;
  }

  deleteCoffee() {
    return 'Hello from serice';
  }
}
