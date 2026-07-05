/*
  Warnings:

  - You are about to drop the column `workoutPlanId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `mealItemId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `mealPlanId` on the `MealItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name_en]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ar]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_workoutPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_mealItemId_fkey";

-- DropForeignKey
ALTER TABLE "MealItem" DROP CONSTRAINT "MealItem_mealPlanId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "workoutPlanId";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "mealItemId";

-- AlterTable
ALTER TABLE "MealItem" DROP COLUMN "mealPlanId";

-- CreateTable
CREATE TABLE "MealPlanItem" (
    "id" SERIAL NOT NULL,
    "mealPlanId" INTEGER NOT NULL,
    "mealItemId" INTEGER NOT NULL,

    CONSTRAINT "MealPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItemIngredient" (
    "id" SERIAL NOT NULL,
    "mealItemId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,

    CONSTRAINT "MealItemIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutPlanExercises" (
    "id" SERIAL NOT NULL,
    "workoutPlanId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "exercise_order" INTEGER NOT NULL,

    CONSTRAINT "WorkoutPlanExercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_en_key" ON "Ingredient"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_ar_key" ON "Ingredient"("name_ar");

-- AddForeignKey
ALTER TABLE "MealPlanItem" ADD CONSTRAINT "MealPlanItem_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanItem" ADD CONSTRAINT "MealPlanItem_mealItemId_fkey" FOREIGN KEY ("mealItemId") REFERENCES "MealItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItemIngredient" ADD CONSTRAINT "MealItemIngredient_mealItemId_fkey" FOREIGN KEY ("mealItemId") REFERENCES "MealItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItemIngredient" ADD CONSTRAINT "MealItemIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlanExercises" ADD CONSTRAINT "WorkoutPlanExercises_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlanExercises" ADD CONSTRAINT "WorkoutPlanExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
