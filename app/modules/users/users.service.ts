import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'

import { CryptoService, PrismaService } from '@/services'

import { TSafeUser } from '@/types'

import { excludeUnsafeFields } from '@/utils'

import { TUserInstance } from './users.interface'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(request: Request) {
    if (!('user' in request)) throw new UnauthorizedException()

    const { id } = request.user as { id: number }

    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!user) throw new UnauthorizedException(`User doesn't exists`)

    const safeUserResponse = excludeUnsafeFields<User, 'password'>(user, [
      'password',
    ])

    return safeUserResponse
  }

  async getUserByUnique(email: string): Promise<NotFoundException | TSafeUser> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) throw new NotFoundException()

    const safeUserResponse = excludeUnsafeFields<User, 'password'>(user, [
      'password',
    ])

    return safeUserResponse
  }

  async createNewUser(body: TUserInstance) {
    const isFilled = Object.values(body).every(field => field.length)

    if (!isFilled) throw new BadRequestException()

    const { email, password } = body

    try {
      const user = await this.getUserByUnique(email)

      if (user) {
        throw new ConflictException()
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        try {
          const hash = await CryptoService.encrypt(password)

          if (typeof hash === 'string') {
            const user = await this.prisma.user.create({
              data: {
                ...body,
                password: hash,
              },
            })

            if (user) {
              const safeUserResponse = excludeUnsafeFields<User, 'password'>(
                user,
                ['password'],
              )

              return safeUserResponse
            }
          }
        } catch (err) {
          return {
            error: err,
          }
        }
      }
    }
  }
}
