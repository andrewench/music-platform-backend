import { UsersController } from './users.controller'
import { Module } from '@nestjs/common'

import { PrismaService } from '@/services'

import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
