import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { User } from '@prisma/client'

import { CryptoService, DatabaseService } from '@/services'

import { TSafeUser } from '@/types'

import { excludeUnsafeFields } from '@/utils'

import { TUserInstance } from './users.interface'

@Injectable()
export class UsersService {
  async getUserByUnique(email: string): Promise<NotFoundException | TSafeUser> {
    const user = await DatabaseService.user.findFirst({
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
            const user = await DatabaseService.user.create({
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
