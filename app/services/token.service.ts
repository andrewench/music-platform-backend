import { JwtService } from '@nestjs/jwt'

import Constants from '@/constants'

const { Tokens } = Constants

export class TokenService {
  protected static generatedAccessToken: string
  protected static generatedRefreshToken: string

  public static async generateTokens(
    jwt: JwtService,
    payload: Record<string, any>,
  ) {
    this.generatedAccessToken = await jwt.signAsync(payload, {
      expiresIn: Tokens.ACCESS_TOKEN_LIFE_TIME,
      secret: Tokens.ACCESS_TOKEN_SECRET_KEY,
    })

    this.generatedRefreshToken = await jwt.signAsync(payload, {
      expiresIn: Tokens.REFRESH_TOKEN_LIFE_TIME,
      secret: Tokens.REFRESH_TOKEN_SECRET_KEY,
    })
  }

  protected static createTokenHeader({
    type,
    path,
  }: {
    type: 'access_token' | 'refresh_token'
    path: string
  }): string {
    const cookieProperties = [
      `path=${path};`,
      `domain=${process.env.DOMAIN_NAME};`,
    ]

    if (type === 'access_token') {
      cookieProperties.unshift(
        `${Tokens.ACCESS_TOKEN_PREFIX}=${this.generatedAccessToken};`,
      )
      cookieProperties.push(
        `expires=${new Date(
          Date.now() + 1000 * Tokens.ACCESS_TOKEN_LIFE_TIME,
        )};`,
      )
    }

    if (type === 'refresh_token') {
      cookieProperties.push('httpOnly=true;')
      cookieProperties.unshift(
        `${Tokens.REFRESH_TOKEN_PREFIX}=${this.generatedRefreshToken};`,
      )
      cookieProperties.push(
        `expires=${new Date(
          Date.now() + 1000 * Tokens.REFRESH_TOKEN_LIFE_TIME,
        )};`,
      )
    }

    return cookieProperties.join(' ').trim()
  }

  protected static createExpiredCookieHeader({
    type,
  }: {
    type: 'access_token' | 'refresh_token'
  }): string {
    const cookieProperties = [
      `path=/;`,
      `expires=${new Date(Date.now() - 1000)};`,
      `domain=${process.env.DOMAIN_NAME};`,
    ]

    if (type === 'access_token') {
      cookieProperties.unshift(`${Tokens.ACCESS_TOKEN_PREFIX}=;`)
    }

    if (type === 'refresh_token') {
      cookieProperties.unshift(`${Tokens.REFRESH_TOKEN_PREFIX}=;`)
      cookieProperties.push('httpOnly=true')
    }

    return cookieProperties.join(' ').trim()
  }

  public static generateHeaders() {
    const accessTokenCookieHeader = this.createTokenHeader({
      type: 'access_token',
      path: '/',
    })

    const refreshTokenCookieHeader = this.createTokenHeader({
      type: 'refresh_token',
      path: '/',
    })

    return {
      accessTokenCookieHeader,
      refreshTokenCookieHeader,
    }
  }

  public static generateExpiredHeaders() {
    const accessTokenExpiredHeader = this.createExpiredCookieHeader({
      type: 'access_token',
    })

    const refreshTokenExpiredHeader = this.createExpiredCookieHeader({
      type: 'refresh_token',
    })

    return {
      accessTokenExpiredHeader,
      refreshTokenExpiredHeader,
    }
  }
}
