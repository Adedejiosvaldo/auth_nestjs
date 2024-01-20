import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDTO } from '../create-coffee.entity/create-coffee.entity';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDTO) {}
