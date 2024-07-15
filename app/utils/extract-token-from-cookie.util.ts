import { UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import Constants from '@/constants'

export const extractTokenFromCookie = ({
  request,
  type,
}: {
  request: Request
  type: 'access_token' | 'refresh_token'
}): string | undefined => {
  const cookie = request.headers.cookie

  if (!cookie) throw new UnauthorizedException()

  const cookiesList = cookie.split(/;\s*/)

  let extractedToken: string | undefined

  const tokenPrefix =
    type === 'access_token'
      ? Constants.Tokens.ACCESS_TOKEN_PREFIX
      : Constants.Tokens.REFRESH_TOKEN_PREFIX

  const tokenPatternPrefix = new RegExp(`${tokenPrefix}=\\w+`)

  cookiesList.forEach(token => {
    if (token.search(tokenPatternPrefix) !== -1) {
      extractedToken = token.split('=')[1]
    }
  })

  return extractedToken
}
