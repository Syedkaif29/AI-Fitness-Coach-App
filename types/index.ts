export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutLocation: 'home' | 'gym' | 'outdoor';
  dietaryPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto';
  medicalHistory?: string;
  stressLevel?: 'low' | 'medium' | 'high';
}

export interface WorkoutPlan {
  day: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: string;
  description?: string;
}

export interface MealPlan {
  mealType: string;
  items: string[];
  calories?: string;
}

export interface DietPlan {
  meals: MealPlan[];
}

export interface FitnessPlan {
  workoutPlan: WorkoutPlan[];
  dietPlan: DietPlan;
  tips: string[];
  motivation: string;
}
