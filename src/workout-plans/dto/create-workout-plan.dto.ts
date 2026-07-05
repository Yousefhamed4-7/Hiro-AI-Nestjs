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
import { ApiProperty } from '@nestjs/swagger';

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

class PlanExerciseDto {
  @ApiProperty({ example: 1, description: 'Exercise ID' })
  @IsInt()
  @IsNotEmpty()
  exerciseId!: number;

  @ApiProperty({ example: 1, description: 'Order of exercise in the plan' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  exercise_order!: number;
}

export class CreateWorkoutPlanDto {
  @ApiProperty({ example: 'WP001', description: 'Unique workout plan code' })
  @IsString()
  @IsNotEmpty()
  workout_code!: string;

  @ApiProperty({
    example: 'Upper Body Strength',
    description: 'Name of the workout plan',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    enum: WorkoutGoal,
    example: 'BM',
    description: 'Workout goal',
  })
  @IsEnum(WorkoutGoal)
  @IsNotEmpty()
  goal!: 'LW' | 'BM' | 'MC' | 'RI';

  @ApiProperty({
    enum: DifficultyLevel,
    example: 'intermediate',
    description: 'Difficulty level',
  })
  @IsEnum(DifficultyLevel)
  @IsNotEmpty()
  difficulty!: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration_minutes!: number;

  @ApiProperty({
    example: ['Chest', 'Shoulders', 'Triceps'],
    description: 'Target muscle groups',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  target_muscle_groups!: string[];

  @ApiProperty({ example: 300, description: 'Estimated calories burned' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  estimated_calories!: number;

  @ApiProperty({
    enum: GenderPreference,
    example: 'any',
    description: 'Gender preference',
  })
  @IsEnum(GenderPreference)
  @IsNotEmpty()
  gender_preference!: 'male' | 'female' | 'any';

  @ApiProperty({
    example: 'Full upper body workout focusing on strength',
    description: 'Plan description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 5, description: 'Number of exercises' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  exercise_count!: number;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'Array of image URLs',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: ['https://example.com/video1.mp4'],
    description: 'Array of video URLs',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  @IsNotEmpty()
  categoryId!: number;

  @ApiProperty({
    type: [PlanExerciseDto],
    description: 'Array of exercises in this plan',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanExerciseDto)
  exercises?: PlanExerciseDto[];
}
