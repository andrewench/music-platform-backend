import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  firstName: string

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  login: string

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
