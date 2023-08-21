import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { PrismaService } from '@/services'

import { AuthModule, UsersModule } from '@/modules'

import Constant from '@/constants'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: Constant.STATIC_PATH,
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
