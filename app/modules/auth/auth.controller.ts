import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { TSignInFields, TSignUpFields } from '@/types'

import { AuthGuard } from '@/guards'

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

  @Post('/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body)
  }

  @UseGuards(AuthGuard)
  @Delete('/logout')
  async logout(@Req() request: Request) {
    return this.authService.logout(request)
  }
}
