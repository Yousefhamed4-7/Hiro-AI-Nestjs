import { PartialType } from '@nestjs/mapped-types';
import { CreateMealPlansDto } from './create-meal-plans.dto';

export class UpdateMealPlanDto extends PartialType(CreateMealPlansDto) {}
