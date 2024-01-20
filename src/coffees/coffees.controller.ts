import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDTO } from './dto/create-coffee.entity/create-coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  getAllCoffees() {
    return this.coffeeService.getAllCoffees();
  }

  @Get(':id')
  getACoffee(@Param('id') id: string) {
    return this.coffeeService.getACoffee(id);
  }

  @Post()
  create(@Body() body: CreateCoffeeDTO) {
    return this.coffeeService.createCoffee(body);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() body: UpdateCoffeeDto) {
    return this.coffeeService.updateCoffee(id, body);
  }
}
