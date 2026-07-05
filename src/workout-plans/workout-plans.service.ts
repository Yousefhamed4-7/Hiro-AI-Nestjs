import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UnformattedWorkoutPlanInterface,
  WorkoutPlanInterface,
} from './interfaces/workout-plans.interface';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { Prisma } from '../generated/prisma/client';
import { UpdateWokroutPlanDto } from './dto/update-workout-plan.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const result = await this.prismaService.workoutPlan.findMany({
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
        workoutPlanExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    const output: WorkoutPlanInterface[] = [];

    result.forEach((item) => {
      const formattedWorkoutPlan = this.formatWorkoutPlan(
        item as UnformattedWorkoutPlanInterface,
      );
      output.push(formattedWorkoutPlan);
    });

    return output;
  }

  async getOne(id: number) {
    const workoutPlan = await this.prismaService.workoutPlan.findUnique({
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
        workoutPlanExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
    if (!workoutPlan) {
      throw new NotFoundException('workout-plans.notFound');
    }

    const formattedWorkoutPlan = this.formatWorkoutPlan(
      workoutPlan as UnformattedWorkoutPlanInterface,
    );

    return formattedWorkoutPlan;
  }

  async create(createWorkoutPlanDto: CreateWorkoutPlanDto) {
    const { exercises, ...restOfData } = createWorkoutPlanDto;

    try {
      const workoutPlan = await this.prismaService.workoutPlan.create({
        data: {
          ...restOfData,
          workoutPlanExercises: {
            create: exercises?.map((exe) => ({
              exerciseId: exe.exerciseId,
              exercise_order: exe.exercise_order,
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
          workoutPlanExercises: {
            include: {
              exercise: true,
            },
          },
        },
      });

      const formattedWorkoutPlan = this.formatWorkoutPlan(
        workoutPlan as UnformattedWorkoutPlanInterface,
      );

      return formattedWorkoutPlan;
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const metaData = err.meta as any;
        if (err.code === 'P2002') {
          const fields = metaData.driverAdapterError.cause.constraint.fields;

          throw new ConflictException({
            message: `workout-plans.exists`,
            fields,
          });
        }
        if (err.code === 'P2003') {
          const message = err.message;

          const field = message.slice(
            message.indexOf('constraint: ') + 'constraint: '.length,
            message.length,
          );
          throw new BadRequestException({
            message: 'workout-plans.foreignKeyFail',
            fields: [field],
          });
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

  async update(id: number, updateWorkoutPlanDto: UpdateWokroutPlanDto) {
    const planExists = await this.prismaService.workoutPlan.findUnique({
      where: {
        id,
      },
    });

    if (!planExists) {
      throw new NotFoundException(`workout-plans.notFound`);
    }

    const { exercises, ...planData } = updateWorkoutPlanDto;
    try {
      const updatedPlan = await this.prismaService.$transaction(async (tx) => {
        //if user wants to update exercises wipe the many-many table for a cleaner input
        if (exercises) {
          await tx.workoutPlanExercises.deleteMany({
            where: { workoutPlanId: id },
          });
        }

        const updated = await tx.workoutPlan.update({
          where: { id },
          data: {
            ...planData,
            ...(exercises && {
              workoutPlanExercises: {
                create: exercises.map((exe) => ({
                  exerciseId: exe.exerciseId,
                  exercise_order: exe.exercise_order,
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
            workoutPlanExercises: {
              include: {
                exercise: true,
              },
            },
          },
        });
        return updated;
      });

      const parsedPlan = this.formatWorkoutPlan(
        updatedPlan as UnformattedWorkoutPlanInterface,
      );

      return parsedPlan;
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const metaData = err.meta as any;
        if (err.code === 'P2002') {
          const fields = metaData.driverAdapterError.cause.constraint.fields;

          throw new ConflictException({
            message: `workout-plans.exists`,
            fields,
          });
        }
        if (err.code === 'P2003') {
          const message = err.message;

          const field = message.slice(
            message.indexOf('constraint: ') + 'constraint: '.length,
            message.length,
          );
          throw new BadRequestException({
            message: 'workout-plans.foreignKeyFail',
            fields: [field],
          });
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
      await this.prismaService.workoutPlan.delete({
        where: { id },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`workout-plans.notFound`);
        }
        throw new InternalServerErrorException(
          'Something went wrong while deleting the workout plan',
          {
            description: err.message,
          },
        );
      }

      throw new InternalServerErrorException('Could not complete deletion.');
    }
  }

  formatWorkoutPlan(workoutPlan: UnformattedWorkoutPlanInterface) {
    const { workoutPlanExercises, ...restOfPlan } = workoutPlan;

    return {
      ...restOfPlan,
      exercises: workoutPlanExercises.map((exer) => ({
        ...exer.exercise,
        exercise_order: exer.exercise_order,
      })),
    };
  }
}
