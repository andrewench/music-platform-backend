import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  Type,
  mixin,
} from '@nestjs/common'
import { NextFunction } from 'express'

import { isAllFieldsPassedCorrectly } from '@/utils'

export const BodyValidator = (validFields: string[]): Type<NestMiddleware> => {
  @Injectable()
  class BodyValidatorMiddleware implements NestMiddleware {
    use({ body }: Request, _: never, next: NextFunction) {
      const isFieldsValid = isAllFieldsPassedCorrectly({
        body,
        validFields,
      })

      if (!isFieldsValid) throw new BadRequestException()

      next()
    }
  }

  return mixin(BodyValidatorMiddleware)
}
