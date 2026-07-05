import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  // @ApiProperty({ example: 'test@gmail.com', description: 'the email' })
  email!: string;
  @IsNotEmpty()
  password!: string;
}
