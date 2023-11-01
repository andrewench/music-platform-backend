import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '@/services'

import { UsersController } from './users.controller'

import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService],
})
export class UsersModule {}
