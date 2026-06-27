import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meal } from '../../types';

interface MealsState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MealsState = {
  meals: [],
  isLoading: false,
  error: null,
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = action.payload;
    },
    addMeal: (state, action: PayloadAction<Meal>) => {
      state.meals.unshift(action.payload);
    },
    removeMeal: (state, action: PayloadAction<string>) => {
      state.meals = state.meals.filter((meal) => meal.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setMeals, addMeal, removeMeal, setError } = mealsSlice.actions;
export default mealsSlice.reducer;
