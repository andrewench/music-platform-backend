import { Body, Controller, Post } from '@nestjs/common'

import { TSignInFields, TSignUpFields } from '@/types'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() credentials: TSignInFields) {
    return this.authService.login(credentials)
  }

  @Post('/signup')
  async signup(@Body() body: TSignUpFields) {
    return this.authService.signup(body)
  }
}
