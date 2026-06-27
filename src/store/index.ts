import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mealsReducer from './slices/mealsSlice';
import glucoseReducer from './slices/glucoseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealsReducer,
    glucose: glucoseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
