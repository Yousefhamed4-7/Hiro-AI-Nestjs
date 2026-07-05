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
import { Translate } from '../common/decorators/translate.decorator';

@Controller('api/v2/meal-plans')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get()
  @Translate('meal-plans.getAll')
  async getAll() {
    const data = await this.mealPlansService.getAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Meal-plans fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Translate('meal-plans.getOne')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.mealPlansService.getOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Meal-plan fetched successfully',
      data,
    };
  }

  @Post()
  @Translate('meal-plans.create')
  async create(@Body() createMealPlansDto: CreateMealPlansDto) {
    const data = await this.mealPlansService.create(createMealPlansDto);
    return {
      success: true,
      statusCode: 201,
      message: 'Meal-plan created successfully',
      data,
    };
  }

  @Put(':id')
  @Translate('meal-plans.update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealPlanDto: UpdateMealPlanDto,
  ) {
    const data = await this.mealPlansService.update(id, updateMealPlanDto);

    return {
      success: true,
      statusCode: 200,
      message: 'Meal-plan successfully updated',
      data,
    };
  }

  @Delete(':id')
  @Translate('meal-plans.delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.mealPlansService.delete(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Meal-plan deleted successfully',
    };
  }
}
