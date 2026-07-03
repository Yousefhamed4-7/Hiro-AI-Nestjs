import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async findByUsernameOrEmail(username: string, email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    return await this.prismaService.user.create({
      data: data,
    });
  }

  async isValidPassword(password, hashed) {
    return await bcrypt.compare(password, hashed);
  }
}
