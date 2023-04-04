import { hash } from 'argon2'

export class CryptoService {
  public static async encrypt(password: string): Promise<string | Error> {
    try {
      const hashedPassword = await hash(password)

      return hashedPassword
    } catch (err) {
      throw new Error(err)
    }
  }
}
