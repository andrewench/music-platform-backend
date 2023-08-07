import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from '@/services'

import { AuthModule, UsersModule } from '@/modules'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
