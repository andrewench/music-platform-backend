import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { extractTokenFromCookie } from '@/utils'

import Constants from '@/constants'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const accessToken = extractTokenFromCookie({
      request,
      type: 'access_token',
    })

    if (!accessToken) throw new UnauthorizedException()

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: Constants.Tokens.ACCESS_TOKEN_SECRET_KEY,
      })

      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }
}
