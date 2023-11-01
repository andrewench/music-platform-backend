import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  login: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
