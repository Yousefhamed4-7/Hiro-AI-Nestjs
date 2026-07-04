import { Module } from '@nestjs/common';
import { MealPlansController } from './meal-plans.controller';
import { MealPlansService } from './meal-plans.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MealPlansController],
  providers: [MealPlansService, JwtService],
  imports: [PrismaModule],
})
export class MealPlansModule {}
