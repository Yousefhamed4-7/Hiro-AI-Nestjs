import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email!: string;

  @ApiProperty({ example: 'SecurePass123', description: 'Password' })
  @IsNotEmpty()
  @IsDefined()
  password!: string;
}
