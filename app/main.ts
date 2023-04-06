import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'

import { PrismaService } from '@/services'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.SERVER_PORT)
}

bootstrap()
