import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import { CreateMealPlansDto } from './dto/create-meal-plans.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plans.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('meal-plans')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get()
  async getAll() {
    const data = await this.mealPlansService.getAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plans fetched successfully',
      data,
    };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.mealPlansService.getOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan fetched successfully',
      data,
    };
  }

  @Post()
  async create(@Body() createMealPlansDto: CreateMealPlansDto) {
    const data = await this.mealPlansService.create(createMealPlansDto);
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
    @Body() updateMealPlanDto: UpdateMealPlanDto,
  ) {
    const data = await this.mealPlansService.update(id, updateMealPlanDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Workout plan successfully updated',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.mealPlansService.delete(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Workout-plan deleted successfully',
    };
  }
}
