import { getApiRoute } from './get-api-route.util'
import { MiddlewareConsumer, RequestMethod, Type } from '@nestjs/common'

import { TApiEndpoints } from '@/types'

export const applyMiddleware = (
  consumer: MiddlewareConsumer,
  // eslint-disable-next-line
  middleware: Function | Type<any>,
  route: TApiEndpoints,
  method: keyof typeof RequestMethod,
) => {
  return consumer.apply(middleware).forRoutes({
    path: getApiRoute(route),
    method: RequestMethod[method],
  })
}
