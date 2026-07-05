import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  IsOptional,
  ArrayNotEmpty,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum MealPlanGoal {
  LOSS_WEIGHT = 'LW',
  BUILD_MUSCLE = 'BM',
  MAINTAIN_CALORIES = 'MC',
  RECOVERY_INFO = 'RI',
}

export class MealItemDto {
  @ApiProperty({ example: 1, description: 'Meal item ID' })
  @IsNotEmpty({ message: 'Meal item ID must have a value' })
  @IsDefined({ message: 'Meal item ID is required' })
  @IsNumber({}, { message: 'Meal item ID must be a number' })
  mealItemId!: number;
}

export class CreateMealPlansDto {
  @ApiProperty({ example: 'MEAL001', description: 'Unique plan code' })
  @IsNotEmpty({ message: 'Plan code must have a value' })
  @IsDefined({ message: 'Plann code is required' })
  @IsString({ message: 'Plan code must be a string' })
  plan_code!: string;

  @ApiProperty({
    example: 'Weight Loss Meal Plan',
    description: 'Name of the meal plan',
  })
  @IsNotEmpty({ message: 'Name must have a value' })
  @IsDefined({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @ApiProperty({
    enum: MealPlanGoal,
    example: 'LW',
    description: 'Goal of the plan',
  })
  @IsNotEmpty({ message: 'Goal must have a value' })
  @IsDefined({ message: 'Goal is required' })
  @IsEnum(MealPlanGoal, { message: 'Goal must be one of: LW, BM, MC, RI' })
  goal!: MealPlanGoal;

  @ApiProperty({ example: 2000, description: 'Target calories per day' })
  @IsNotEmpty({ message: 'Target calories must have a value' })
  @IsDefined({ message: 'Target calories is required' })
  @IsNumber({}, { message: 'Target calories must be a number' })
  @Min(0, { message: 'Target calories must be a positive number' })
  target_calories!: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of image URLs',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'images must be provided in an array' })
  @IsString({ each: true, message: 'each image must be a string' })
  images?: string[];

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsDefined({ message: 'Category ID is required' })
  @IsNotEmpty({ message: 'Category ID must have a value' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  @Min(1, { message: 'Category ID must be a positive number' })
  categoryId!: number;

  @ApiProperty({
    type: [MealItemDto],
    description: 'Array of meal items in this plan',
  })
  @ArrayNotEmpty({ message: 'Meals should not be empty' })
  @IsArray({ message: 'Meals must be an array' })
  @ValidateNested({ each: true })
  @Type(() => MealItemDto)
  meals!: MealItemDto[];
}
