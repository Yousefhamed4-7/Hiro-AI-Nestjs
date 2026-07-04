import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealPlansDto } from './dto/create-meal-plans.dto';
import { Prisma } from '../generated/prisma/client';
import { UpdateMealPlanDto } from './dto/update-meal-plans.dto';
import {
  IngredientInterface,
  MealItemInterface,
  MealPlanInterface,
} from './interface/meal-plans.interface';
import { treeifyError } from 'zod';

@Injectable()
export class MealPlansService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const mealPlans = await this.prismaService.mealPlan.findMany({
      omit: {
        categoryId: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
          },
        },
        meals: {
          omit: {
            mealPlanId: true,
            mealItemId: true,
            id: true,
          },
          include: {
            mealItem: {
              include: {
                ingredients: {
                  omit: {
                    id: true,
                    mealItemId: true,
                    ingredientId: true,
                  },
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return mealPlans.map((plan) => ({
      ...plan,
      meals: plan.meals.map((m) => this.formatMealItem(m.mealItem as any)),
    }));
  }

  formatMealItem(
    mealItem: MealItemInterface & {
      ingredients: { ingredient: IngredientInterface }[];
    },
  ) {
    return {
      ...mealItem,
      id: mealItem.id,
      meal_name: mealItem.meal_name,
      calories: mealItem.calories,
      protien_g: mealItem.protein_g,
      carbs_g: mealItem.carbs_g,
      fat_g: mealItem.fat_g,
      ingredients: mealItem.ingredients.map((ing) => ing.ingredient),
    };
  }

  async getOne(id: number) {
    const mealPlan = await this.prismaService.mealPlan.findUnique({
      where: {
        id,
      },
      omit: {
        categoryId: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
          },
        },
        meals: {
          omit: {
            mealPlanId: true,
            mealItemId: true,
            id: true,
          },
          include: {
            mealItem: {
              include: {
                ingredients: {
                  omit: {
                    id: true,
                    mealItemId: true,
                    ingredientId: true,
                  },
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mealPlan) {
      throw new NotFoundException('Meal plan not found');
    }

    return {
      ...mealPlan,
      meals: mealPlan.meals.map((m) => this.formatMealItem(m.mealItem as any)),
    };
  }

  async create(createMealPlansDto: CreateMealPlansDto) {
    const { meals, ...restOfPlan } = createMealPlansDto;

    try {
      const mealPlan = await this.prismaService.mealPlan.create({
        data: {
          ...restOfPlan,
          meals: {
            create: meals.map((m) => ({
              mealItemId: m.mealItemId,
            })),
          },
        },
        omit: {
          categoryId: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
            },
          },
          meals: {
            omit: {
              mealPlanId: true,
              mealItemId: true,
              id: true,
            },
            include: {
              mealItem: {
                include: {
                  ingredients: {
                    omit: {
                      id: true,
                      mealItemId: true,
                      ingredientId: true,
                    },
                    include: {
                      ingredient: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        ...mealPlan,
        meals: mealPlan.meals.map((m) =>
          this.formatMealItem(m.mealItem as any),
        ),
      };
    } catch (err: any) {
      Logger.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const metaData = err.meta as any;
          const fields = metaData.driverAdapterError.cause.constraint.fields;

          throw new ConflictException(
            `A workout plan with this ' ${fields.join(' ')} ' already exists`,
          );
        }
        throw new InternalServerErrorException(
          'Something went wrong with the ORM while creating the workout plan',
          {
            description: err.message,
          },
        );
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating workout plan',
      );
    }
  }

  async update(id: number, updateMealPlanDto: UpdateMealPlanDto) {
    const exists = await this.prismaService.mealPlan.findUnique({
      where: {
        id,
      },
    });

    if (!exists) {
      throw new NotFoundException('Meal plan not found');
    }
    try {
      const updatedPlan = await this.prismaService.$transaction(async (tx) => {
        const { meals, ...restOfPlan } = updateMealPlanDto;

        if (meals) {
          await tx.mealPlanItem.deleteMany({
            where: {
              mealPlanId: id,
            },
          });
        }

        const updated = await tx.mealPlan.update({
          where: {
            id,
          },
          data: {
            ...restOfPlan,
            ...(meals && {
              meals: {
                create: meals.map((m) => ({
                  mealItemId: m.mealItemId,
                })),
              },
            }),
          },
          omit: {
            categoryId: true,
          },
          include: {
            category: {
              select: {
                id: true,
                name_ar: true,
                name_en: true,
              },
            },
            meals: {
              omit: {
                mealPlanId: true,
                mealItemId: true,
                id: true,
              },
              include: {
                mealItem: {
                  include: {
                    ingredients: {
                      omit: {
                        id: true,
                        mealItemId: true,
                        ingredientId: true,
                      },
                      include: {
                        ingredient: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return updated;
      });

      return {
        ...updatedPlan,
        meals: updatedPlan.meals.map((m) =>
          this.formatMealItem(m.mealItem as any),
        ),
      };
    } catch (err: any) {
      Logger.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const metaData = err.meta as any;
          const fields = metaData.driverAdapterError.cause.constraint.fields;

          throw new ConflictException(
            `A workout plan with this ' ${fields.join(' ')} ' already exists`,
          );
        }
        throw new InternalServerErrorException(
          'Something went wrong with the ORM while creating the workout plan',
          {
            description: err.message,
          },
        );
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating workout plan',
      );
    }
  }

  async delete(id: number) {
    try {
      await this.prismaService.mealPlan.delete({ where: { id } });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(
            `Meal plan with ID ${id} does not exist.`,
          );
        }
        throw new InternalServerErrorException(
          'Something went wrong with the ORM while creating the meal plan',
          {
            description: err.message,
          },
        );
      }

      throw new InternalServerErrorException('Could not complete deletion.');
    }
  }
}
