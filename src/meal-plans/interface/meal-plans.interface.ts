export interface CategoryInterface {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientInterface {
  id: number;
  name_en: string;
  name_ar: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealItemInterface {
  id: number;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealInterface {
  id: number;
  mealPlanId: number;
  mealItemId: number;
  mealItem: MealInterface;
}

export interface MealPlanInterface {
  id: number;
  plan_code: string;
  name: string;
  goal: string;
  target_calories: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  category: CategoryInterface;
  meals: MealInterface[];
}
