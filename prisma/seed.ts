import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import {
  PrismaClient,
  PlanGoal,
  Difficulty,
  GenderPreference,
} from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('🌱 Clearing old seed tracking entries...');
  // Optional wipe to guarantee clean upserts without duplication keys
  await prisma.workoutPlanExercises.deleteMany();
  await prisma.mealPlanItem.deleteMany();
  await prisma.mealItemIngredient.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.workoutPlanCategory.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.mealItem.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.mealPlanCategory.deleteMany();

  console.log('🥦 Seeding Master Ingredients...');
  const oats = await prisma.ingredient.create({
    data: {
      name_en: 'Rolled Oats Pack',
      name_ar: 'شوفان',
      quantity: 60.0,
      unit: 'g',
      calories: 230.0,
      protein_g: 8.0,
      carbs_g: 40.0,
      fat_g: 4.0,
    },
  });

  const milk = await prisma.ingredient.create({
    data: {
      name_en: 'Whole Milk Glass',
      name_ar: 'حليب كامل الدسم',
      quantity: 200.0,
      unit: 'ml',
      calories: 120.0,
      protein_g: 7.0,
      carbs_g: 10.0,
      fat_g: 5.0,
    },
  });

  const chicken = await prisma.ingredient.create({
    data: {
      name_en: 'Grilled Chicken Breast',
      name_ar: 'صدور دجاج مشوية',
      quantity: 200.0,
      unit: 'g',
      calories: 330.0,
      protein_g: 62.0,
      carbs_g: 0.0,
      fat_g: 7.0,
    },
  });

  const rice = await prisma.ingredient.create({
    data: {
      name_en: 'White Basmati Rice Bowl',
      name_ar: 'أرز أبيض',
      quantity: 150.0,
      unit: 'g',
      calories: 200.0,
      protein_g: 4.0,
      carbs_g: 44.0,
      fat_g: 0.5,
    },
  });

  console.log('🍳 Seeding Master Meal Recipes...');
  const oatsAndMilkMeal = await prisma.mealItem.create({
    data: {
      meal_name: 'Oats & Milk Mashup',
      calories: 350.0,
      protein_g: 15.0,
      carbs_g: 50.0,
      fat_g: 9.0,
      ingredients: {
        create: [{ ingredientId: oats.id }, { ingredientId: milk.id }],
      },
    },
  });

  const chickenAndRiceMeal = await prisma.mealItem.create({
    data: {
      meal_name: 'Classic Chicken & Rice',
      calories: 530.0,
      protein_g: 66.0,
      carbs_g: 44.0,
      fat_g: 7.5,
      ingredients: {
        create: [{ ingredientId: chicken.id }, { ingredientId: rice.id }],
      },
    },
  });

  console.log('📂 Seeding Diet Categories & Plans...');
  const mealCategory = await prisma.mealPlanCategory.create({
    data: {
      name_en: 'Weight Loss Diets',
      name_ar: 'أنظمة إنقاص الوزن',
      description_en:
        'Targeted caloric deficits built for functional shredding.',
      description_ar: 'عجز سعرات حرارية مستهدف مصمم للتنشيف الفعال.',
    },
  });

  await prisma.mealPlan.create({
    data: {
      plan_code: 'MP-SHRED-X',
      name: 'Summer Shred Package',
      goal: PlanGoal.LW,
      target_calories: 1800.0,
      categoryId: mealCategory.id,
      meals: {
        create: [
          { mealItemId: oatsAndMilkMeal.id },
          { mealItemId: chickenAndRiceMeal.id },
        ],
      },
    },
  });

  console.log('🏋️ Seeding Master Exercise Pool...');
  const DBPress = await prisma.exercise.create({
    data: {
      exercise_name: 'Incline Dumbbell Press',
      sets: 4,
      exercise_order: 2,
      reps: '8-10',
      duration_seconds: 0,
      rest_seconds: 90,
      notes: 'Focus heavily on the slow negative stretch.',
    },
  });

  const shoulderPress = await prisma.exercise.create({
    data: {
      exercise_name: 'Overhead Barbell Press',
      sets: 3,
      exercise_order: 1,
      reps: '6-8',
      duration_seconds: 0,
      rest_seconds: 120,
      notes: 'Lock out fully at the top but keep core rigid.',
    },
  });

  console.log('🏃 Seeding Workout Packages...');
  const workoutCategory = await prisma.workoutPlanCategory.create({
    data: {
      name_en: 'Strength Training',
      name_ar: 'تمارين القوة',
      description_en:
        'Hypertrophy blocks emphasizing targeted compound stress.',
      description_ar: 'برامج ضخامة عضلية تركز على التمارين المركبة المستهدفة.',
    },
  });

  await prisma.workoutPlan.create({
    data: {
      workout_code: 'WP-PUSH-BUILD',
      name: 'Power Hypertrophy Push',
      goal: PlanGoal.BM,
      difficulty: Difficulty.intermediate,
      duration_minutes: 60,
      target_muscle_groups: ['Chest', 'Shoulders', 'Triceps'],
      estimated_calories: 450.0,
      gender_preference: GenderPreference.any,
      description:
        'An explosive execution routine built around key horizontal pushing patterns.',
      exercise_count: 2,
      categoryId: workoutCategory.id,
      workoutPlanExercises: {
        create: [
          { exerciseId: DBPress.id, exercise_order: 1 },
          { exerciseId: shoulderPress.id, exercise_order: 2 },
        ],
      },
    },
  });

  console.log('🚀 Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
