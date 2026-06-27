export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  barcode?: string;
  timestamp: string;
  imageUrl?: string;
}

export interface GlucoseReading {
  id: string;
  userId: string;
  value: number; // mg/dL
  timestamp: string;
  notes?: string;
}

export interface NutritionStats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealSuggestion {
  id: string;
  userId: string;
  suggestion: string;
  reason: string;
  timestamp: string;
}

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  MealLogging: undefined;
  GlucoseTracking: undefined;
  Profile: undefined;
};
