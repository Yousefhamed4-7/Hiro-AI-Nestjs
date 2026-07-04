import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum WorkoutGoal {
  LW = 'LW',
  BM = 'BM',
  MC = 'MC',
  RI = 'RI',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum GenderPreference {
  ANY = 'any',
  MALE = 'male',
  FEMALE = 'female',
}

// 💡 Sub-DTO to handle the array of exercises linked to this plan
class PlanExerciseDto {
  @IsInt()
  @IsNotEmpty()
  exerciseId!: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  exercise_order!: number;
}

export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  workout_code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(WorkoutGoal) // Update strings to match your exact PlanGoal enum values
  @IsNotEmpty()
  goal!: 'LW' | 'BM' | 'MC' | 'RI';

  @IsEnum(DifficultyLevel) // Matches your Difficulty enum values
  @IsNotEmpty()
  difficulty!: 'beginner' | 'intermediate' | 'advanced';

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration_minutes!: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  target_muscle_groups!: string[];

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  estimated_calories!: number;

  @IsEnum(GenderPreference) // Matches your GenderPreference enum values
  @IsNotEmpty()
  gender_preference!: 'male' | 'female' | 'any';

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  exercise_count!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @IsInt()
  @IsNotEmpty()
  categoryId!: number;

  // 💡 Accepts the array of exercises coming from the frontend dropdown selector
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanExerciseDto)
  exercises?: PlanExerciseDto[];
}
