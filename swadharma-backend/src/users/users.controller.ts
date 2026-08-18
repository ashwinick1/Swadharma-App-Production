import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Received Request:', createUserDto);
    return await this.usersService.create(createUserDto);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.usersService.findById(Number(id));
  }
}