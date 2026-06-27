import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Meal } from '../types';

export const mealService = {
  async addMeal(userId: string, mealData: Omit<Meal, 'id'>): Promise<Meal> {
    try {
      const docRef = await addDoc(collection(db, 'meals'), {
        ...mealData,
        timestamp: new Date().toISOString(),
        userId,
      });

      return {
        ...mealData,
        id: docRef.id,
      } as Meal;
    } catch (error) {
      throw error;
    }
  },

  async getMeals(userId: string): Promise<Meal[]> {
    try {
      const q = query(
        collection(db, 'meals'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const meals: Meal[] = [];

      querySnapshot.forEach((doc) => {
        meals.push({ id: doc.id, ...doc.data() } as Meal);
      });

      return meals;
    } catch (error) {
      throw error;
    }
  },

  async deleteMeal(mealId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'meals', mealId));
    } catch (error) {
      throw error;
    }
  },
};
