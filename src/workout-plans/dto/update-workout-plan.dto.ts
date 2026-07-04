import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutPlanDto } from './create-workout-plan.dto';

export class UpdateWokroutPlanDto extends PartialType(CreateWorkoutPlanDto) {}
