import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  Type,
  mixin,
} from '@nestjs/common'
import { NextFunction, Request } from 'express'

import { TMappedTypes } from '@/types'

import { isAllFieldsPassedCorrectly } from '@/utils'

export const BodyValidator = <TBody extends TMappedTypes>(
  validFields: (keyof TBody)[],
): Type<NestMiddleware> => {
  @Injectable()
  class BodyValidatorMiddleware implements NestMiddleware {
    use({ body }: Request<never, never, TBody>, _: never, next: NextFunction) {
      const isFieldsValid = isAllFieldsPassedCorrectly<TBody, (keyof TBody)[]>({
        body,
        validFields,
      })

      if (!isFieldsValid) throw new BadRequestException()

      next()
    }
  }

  return mixin(BodyValidatorMiddleware)
}
