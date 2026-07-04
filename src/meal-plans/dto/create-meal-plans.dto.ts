import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MealPlanGoal {
  LOSS_WEIGHT = 'LW',
  BUILD_MUSCLE = 'BM',
  MAINTAIN_CALORIES = 'MC',
  RECOVERY_INFO = 'RI',
}

export class MealItemDto {
  @IsNotEmpty({ message: 'Meal item ID is required' })
  @IsNumber({}, { message: 'Meal item ID must be a number' })
  mealItemId!: number;
}

export class CreateMealPlansDto {
  @IsNotEmpty({ message: 'Plan code is required' })
  @IsString({ message: 'Plan code must be a string' })
  plan_code!: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Goal is required' })
  @IsEnum(MealPlanGoal, { message: 'Goal must be one of: LW, BM, MC, RI' })
  goal!: MealPlanGoal;

  @IsNotEmpty({ message: 'Target calories is required' })
  @IsNumber({}, { message: 'Target calories must be a number' })
  @Min(0, { message: 'Target calories must be a positive number' })
  target_calories!: number;

  @IsOptional()
  @IsArray({ message: 'images must be provided in an array' })
  @IsString({ each: true, message: 'each image must be a string' })
  images?: string[];

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  @Min(1, { message: 'Category ID must be a positive number' })
  categoryId!: number;

  @IsArray({ message: 'Meals must be an array' })
  @ValidateNested({ each: true })
  @Type(() => MealItemDto)
  meals!: MealItemDto[];
}
