import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { AuthGuard } from '@/guards'

import { AuthService } from './auth.service'

import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() credentials: SignInDto) {
    return this.authService.login(credentials)
  }

  @Post('/signup')
  async signup(@Body() body: SignUpDto) {
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
