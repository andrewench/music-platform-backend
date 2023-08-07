import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
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

    return {
      accessToken,
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

        return {
          accessToken,
        }
      } else {
        throw new ServiceUnavailableException()
      }
    } else {
      throw new ServiceUnavailableException('Unknown server error')
    }
  }
}
