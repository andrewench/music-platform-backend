import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { AuthGuard } from '@/guards'

import { AuthService } from './auth.service'

import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() credentials: SignInDto, @Res() response: Response) {
    return this.authService.login(credentials, response)
  }

  @Put('/signup')
  async signup(@Body() body: SignUpDto, @Res() response: Response) {
    return this.authService.signup(body, response)
  }

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    return this.authService.refresh(request, response)
  }

  @UseGuards(AuthGuard)
  @Delete('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response)
  }
}
