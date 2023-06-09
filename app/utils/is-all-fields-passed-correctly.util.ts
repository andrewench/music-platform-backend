import { TMappedTypes } from '@/types'

interface IUtilParams<
  TBody extends TMappedTypes,
  TKeys extends (keyof TBody)[],
> {
  body: TBody
  validFields: TKeys
}

export const isAllFieldsPassedCorrectly = <
  TBody extends TMappedTypes,
  TKeys extends (keyof TBody)[],
>({
  body,
  validFields,
}: IUtilParams<TBody, TKeys>): boolean => {
  return validFields.every(key => body.hasOwnProperty(key))
}
