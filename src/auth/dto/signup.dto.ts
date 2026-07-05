import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Password (minimum 8 characters)',
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsDefined()
  password!: string;
}
