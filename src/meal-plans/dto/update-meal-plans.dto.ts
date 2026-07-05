import { PartialType } from '@nestjs/swagger';
import { CreateMealPlansDto } from './create-meal-plans.dto';

export class UpdateMealPlanDto extends PartialType(CreateMealPlansDto) {}
