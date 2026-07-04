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
    AuthModule,
    UserModule,
    PrismaModule,
    WorkoutPlansModule,
    ExercisesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
