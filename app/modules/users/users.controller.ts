import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Put,
} from '@nestjs/common'

import { TSafeUser } from '@/types'

import { TUserInstance } from './users.interface'

import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  @HttpCode(200)
  async getUserByUnique(
    @Body('email') email: string,
  ): Promise<NotFoundException | TSafeUser> {
    return this.usersService.getUserByUnique(email)
  }

  @Put('/register')
  async createNewUser(@Body() body: TUserInstance) {
    return this.usersService.createNewUser(body)
  }
}
