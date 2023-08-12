import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'

import { TSafeUser } from '@/types'

import { AuthGuard } from '@/guards'

import { TUserInstance } from './users.interface'

import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/user/me')
  async getMe(
    @Req()
    request: Request,
  ) {
    return this.usersService.getMe(request)
  }

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
