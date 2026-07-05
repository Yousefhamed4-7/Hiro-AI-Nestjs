export interface ExercisesInterface {
  id: number;
  exercise_order: number;
  exercise_name: string;
  sets: number;
  reps: string;
  duration_seconds: number;
  rest_seconds: number;
  notes: string;
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlanInterface {
  id: number;
  workout_code: string;
  name: string;
  goal: string;
  difficulty: 'intermediate' | 'beginner' | 'advanced';
  duration_minutes: number;
  target_muscle_groups: string[];
  estimated_calories: number;
  gender_preference: 'any' | 'male' | 'female';
  description: string;
  exercise_count: number;
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId?: number;
  exercises: ExercisesInterface[];
}

export interface UnformattedWorkoutPlanInterface extends Omit<
  WorkoutPlanInterface,
  'exercises' | 'categoryId'
> {
  workoutPlanExercises: {
    exerciseId: number;
    workoutPlanId: number;
    exercise_order: number;
    exercise: ExercisesInterface;
  }[];
}
