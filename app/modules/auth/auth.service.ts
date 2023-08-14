import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { CryptoService, PrismaService } from '@/services'

import { TSignInFields, TSignUpFields } from '@/types'

import Constant from '@/constants'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(credentials: TSignInFields) {
    const { login, password } = credentials

    const user = await this.prisma.user.findFirst({
      where: {
        login,
      },
    })

    if (!user)
      throw new NotFoundException(`User doesn't exists`, {
        description: 'userNoExists',
      })

    const validPassword = await CryptoService.verify(user.password, password)

    if (!validPassword)
      throw new ForbiddenException('Invalid login or password', {
        description: 'invalidCredentials',
      })

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: Constant.AT_LIFE_TIME,
        secret: Constant.AT_SECRET_KEY,
      },
    )

    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: Constant.RT_LIFE_TIME,
        secret: Constant.RT_SECRET_KEY,
      },
    )

    return {
      accessToken,
      refreshToken,
    }
  }

  async signup(credentials: TSignUpFields) {
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

    if (user)
      throw new ConflictException('User already exists', {
        description: 'userExists',
      })

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
        const accessToken = await this.jwtService.signAsync(
          {
            id: user.id,
            role: user.role,
          },
          {
            expiresIn: Constant.AT_LIFE_TIME,
            secret: Constant.AT_SECRET_KEY,
          },
        )

        const refreshToken = await this.jwtService.signAsync(
          {
            id: user.id,
            role: user.role,
          },
          {
            expiresIn: Constant.RT_LIFE_TIME,
            secret: Constant.RT_SECRET_KEY,
          },
        )

        return {
          accessToken,
          refreshToken,
        }
      } else {
        throw new ServiceUnavailableException()
      }
    } else {
      throw new ServiceUnavailableException('Unknown server error')
    }
  }

  async refresh(body: { refreshToken: string }) {
    const payload = await this.jwtService.verifyAsync(body.refreshToken, {
      secret: process.env.RT_SECRET_KEY,
    })

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    })

    if (!user) throw new UnauthorizedException(`User doesn't exists`)

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: Constant.AT_LIFE_TIME,
        secret: Constant.AT_SECRET_KEY,
      },
    )

    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
      },
      {
        expiresIn: Constant.RT_LIFE_TIME,
        secret: Constant.RT_SECRET_KEY,
      },
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}
