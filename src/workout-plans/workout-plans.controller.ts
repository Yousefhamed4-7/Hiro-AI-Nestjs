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

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly workoutPlansService: WorkoutPlansService) {}

  @Get()
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
      message: 'Workout plan successfully updated',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.workoutPlansService.delete(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan deleted successfully',
    };
  }
}
