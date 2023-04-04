import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UsersModule } from '@/modules'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  providers: [],
})
export class AppModule {}
