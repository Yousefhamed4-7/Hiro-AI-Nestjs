import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { UpdateWokroutPlanDto } from './dto/update-workout-plan.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Translate } from '../common/decorators/translate.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('api/v2/workout-plans')
export class WorkoutPlansController {
  constructor(private readonly workoutPlansService: WorkoutPlansService) {}

  @Get()
  @Translate('workout-plans.getAll')
  async getAll() {
    const data = await this.workoutPlansService.getAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plans fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Translate('workout-plans.getOne')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.workoutPlansService.getOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan fetched successfully',
      data,
    };
  }

  @Post()
  @Translate('workout-plans.create')
  async create(@Body() createWorkoutPlanDto: CreateWorkoutPlanDto) {
    const data = await this.workoutPlansService.create(createWorkoutPlanDto);
    return {
      success: true,
      statusCode: 201,
      message: 'Workout-plan created successfully',
      data,
    };
  }

  @Put(':id')
  @Translate('workout-plans.update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutPlanDto: UpdateWokroutPlanDto,
  ) {
    const data = await this.workoutPlansService.update(
      id,
      updateWorkoutPlanDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan successfully updated',
      data,
    };
  }

  @Delete(':id')
  @Translate('workout-plans.delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.workoutPlansService.delete(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan deleted successfully',
    };
  }
}
