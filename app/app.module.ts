import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from '@/services'

import { UsersModule } from '@/modules'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
