export const excludeUnsafeFields = <TUser, TKey extends keyof TUser>(
  user: TUser,
  keys: TKey[],
): Omit<TUser, TKey> => {
  for (const key of keys) {
    delete user[key]
  }

  return user
}
