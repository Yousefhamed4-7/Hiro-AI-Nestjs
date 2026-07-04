import { Module } from '@nestjs/common';
import { WorkoutPlansController } from './workout-plans.controller';
import { WorkoutPlansService } from './workout-plans.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [WorkoutPlansController],
  providers: [WorkoutPlansService, JwtService],
  imports: [PrismaModule],
})
export class WorkoutPlansModule {}
