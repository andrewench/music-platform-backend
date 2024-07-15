import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'

import { CryptoService, PrismaService, TokenService } from '@/services'

import { extractTokenFromCookie } from '@/utils'

import Constants from '@/constants'

import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(credentials: SignInDto, response: Response) {
    const { login, password } = credentials

    const user = await this.prisma.user.findFirst({
      where: {
        login,
      },
    })

    if (!user) {
      throw new NotFoundException(`User doesn't exists`, {
        description: 'userNoExists',
      })
    }

    const validPassword = await CryptoService.verify(user.password, password)

    if (!validPassword) {
      throw new ForbiddenException('Invalid login or password', {
        description: 'invalidCredentials',
      })
    }

    await TokenService.generateTokens(this.jwtService, {
      id: user.id,
      role: user.role,
    })

    const { accessTokenCookieHeader, refreshTokenCookieHeader } =
      TokenService.generateHeaders()

    return response
      .status(200)
      .setHeader('Set-Cookie', [
        accessTokenCookieHeader,
        refreshTokenCookieHeader,
      ])
      .json({
        status: 'OK',
      })
  }

  async signup(credentials: SignUpDto, response: Response) {
    const { firstName, lastName, login, email, password } = credentials

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            login,
          },
          {
            email,
          },
        ],
      },
    })

    if (user) {
      throw new ConflictException('User already exists', {
        description: 'userExists',
      })
    }

    const hashedPassword = await CryptoService.encrypt(password)

    if (typeof hashedPassword === 'string') {
      const cleanedPayload = {
        firstName: firstName[0].toUpperCase() + firstName.slice(1),
        lastName: lastName[0].toUpperCase() + lastName.slice(1),
        login: login.toLowerCase(),
        email,
        password: hashedPassword,
      }

      const user = await this.prisma.user.create({
        data: cleanedPayload,
      })

      if (user) {
        await TokenService.generateTokens(this.jwtService, {
          id: user.id,
          role: user.role,
        })

        const { accessTokenCookieHeader, refreshTokenCookieHeader } =
          TokenService.generateHeaders()

        return response
          .status(200)
          .setHeader('Set-Cookie', [
            accessTokenCookieHeader,
            refreshTokenCookieHeader,
          ])
          .json({
            status: 'OK',
          })
      } else {
        throw new ServiceUnavailableException()
      }
    } else {
      throw new ServiceUnavailableException('Unknown server error')
    }
  }

  async refresh(request: Request, response: Response) {
    const refreshToken = extractTokenFromCookie({
      request,
      type: 'refresh_token',
    })

    if (!refreshToken) throw new UnauthorizedException()

    const { id, role } = await this.jwtService.verifyAsync(refreshToken, {
      secret: Constants.Tokens.REFRESH_TOKEN_SECRET_KEY,
      ignoreExpiration: true,
    })

    await TokenService.generateTokens(this.jwtService, {
      id,
      role,
    })

    const { accessTokenCookieHeader, refreshTokenCookieHeader } =
      TokenService.generateHeaders()

    return response
      .status(200)
      .setHeader('Set-Cookie', [
        accessTokenCookieHeader,
        refreshTokenCookieHeader,
      ])
      .json({
        status: 'OK',
      })
  }

  async logout(request: Request, response: Response) {
    if (!('user' in request)) throw new UnauthorizedException()

    const { accessTokenExpiredHeader, refreshTokenExpiredHeader } =
      TokenService.generateExpiredHeaders()

    return response
      .status(200)
      .setHeader('Set-Cookie', [
        accessTokenExpiredHeader,
        refreshTokenExpiredHeader,
      ])
      .json({
        status: 'OK',
      })
  }
}
