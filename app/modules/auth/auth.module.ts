import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from '@/services'

import { AuthService } from './auth.service'

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
