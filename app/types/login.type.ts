export type TSignUpFields = Record<
  'firstName' | 'lastName' | 'login' | 'email' | 'password',
  string
>
export type TSignInFields = Pick<TSignUpFields, 'email' | 'password'>
export type TRestoreField = Pick<TSignUpFields, 'email'>
