import { hash, verify } from 'argon2'

export class CryptoService {
  public static async encrypt(password: string): Promise<string | Error> {
    try {
      const hashedPassword = await hash(password)

      return hashedPassword
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async verify(hash: string, password: string): Promise<boolean> {
    try {
      const verifiedPassword = verify(hash, password)

      return verifiedPassword
    } catch (error) {
      throw new Error(error)
    }
  }
}
