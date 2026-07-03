import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  username!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
