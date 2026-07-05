import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutPlanDto } from './create-workout-plan.dto';

export class UpdateWokroutPlanDto extends PartialType(CreateWorkoutPlanDto) {}
