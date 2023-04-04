import { UsersController } from './users.controller'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { applyMiddleware } from '@/utils'

import { BodyValidator } from '@/middlewares'

import { VALID_SIGN_UP_FIELDS } from '@/constants'

import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddleware(consumer, BodyValidator(['email']), '/api/users', 'POST'),
      applyMiddleware(
        consumer,
        BodyValidator(VALID_SIGN_UP_FIELDS),
        '/api/register',
        'PUT',
      )
  }
}
