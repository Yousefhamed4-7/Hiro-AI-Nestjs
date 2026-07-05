import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/config/env.validation';
import { WorkoutPlansModule } from './workout-plans/workout-plans.module';
import { ExercisesModule } from './exercises/exercises.module';
import { MealPlansModule } from './meal-plans/meal-plans.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      validationOptions: {
        allowUnknow: true,
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UserModule,
    PrismaModule,
    WorkoutPlansModule,
    ExercisesModule,
    MealPlansModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
