import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { PrismaService } from '@/services'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(process.env.SERVER_PORT)
}

bootstrap()
