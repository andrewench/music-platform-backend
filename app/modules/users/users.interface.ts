import { User } from '@prisma/client'

export type TUserInstance = Pick<
  User,
  'firstName' | 'lastName' | 'login' | 'email' | 'password'
>
