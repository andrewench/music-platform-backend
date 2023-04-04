type TMainApiRoute = '/api'
type TApiEndpoint =
  | '/status'
  | '/join'
  | '/login'
  | '/auth'
  | '/users'
  | '/register'

export type TApiEndpoints = keyof Record<
  `${TMainApiRoute}${TApiEndpoint}`,
  string
>
