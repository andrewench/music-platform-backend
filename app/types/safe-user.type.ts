import { User } from '@prisma/client'

export type TSafeUser = Omit<User, 'password'>
