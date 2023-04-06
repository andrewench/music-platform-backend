import { UsersController } from './users.controller'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { PrismaService } from '@/services'

import { TSignUpFields } from '@/types'

import { applyMiddleware } from '@/utils'

import { BodyValidator } from '@/middlewares'

import { VALID_SIGN_UP_FIELDS } from '@/constants'

import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddleware(
      consumer,
      BodyValidator<{ email: string }>(['email']),
      '/api/users',
      'POST',
    ),
      applyMiddleware(
        consumer,
        BodyValidator<TSignUpFields>(VALID_SIGN_UP_FIELDS),
        '/api/register',
        'PUT',
      )
  }
}
