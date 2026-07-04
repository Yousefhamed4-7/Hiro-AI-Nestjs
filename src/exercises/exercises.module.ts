import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Module({
  providers: [ExercisesService]
})
export class ExercisesModule {}
