import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDTO } from './dto/create-coffee.entity/create-coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Public } from 'src/iam/authentication/decorators/public.decorator';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/jwt.dto';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { MongooseDuplicateExceptionFilter } from 'src/exception/mongoose-duplicate.exception/mongoose-duplicate.exception.filter';
import { ApiKeyGuard } from 'src/iam/authentication/guards/api-key/api-key.guard';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth.type.enums';

// UseGuards
// @UseGuards(ApiKeyGuard)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  //   @UseFilters(MongooseDuplicateExceptionFilter)
  @Auth(AuthType.ApiKey, AuthType.Bearer)
  @Roles(Role.Admin)
  @Post()
  create(@Body() body: CreateCoffeeDTO, @ActiveUser() request: ActiveUserData) {
    console.log(request);
    return this.coffeeService.createCoffee(body);
  }

  //   @Public()
  @Auth(AuthType.ApiKey, AuthType.Bearer)
  //   @Auth(AuthType.None)
  @Get()
  getAllCoffees(@ActiveUser('sub') request: ActiveUserData) {
    return this.coffeeService.getAllCoffees();
  }

  @Roles(Role.User)
  @Get(':id')
  getACoffee(@Param('id') id: string) {
    return this.coffeeService.getACoffee(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id, @Body() body: UpdateCoffeeDto) {
    return this.coffeeService.updateCoffee(id, body);
  }
}
