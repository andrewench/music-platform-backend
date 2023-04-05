import { TSignUpFields } from '@/types'

export const VALID_SIGN_UP_FIELDS: (keyof TSignUpFields)[] = [
  'firstName',
  'lastName',
  'login',
  'email',
  'password',
]
