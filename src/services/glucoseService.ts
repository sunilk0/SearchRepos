import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GlucoseReading } from '../types';

export const glucoseService = {
  async addReading(userId: string, value: number, notes?: string): Promise<GlucoseReading> {
    try {
      const readingData = {
        userId,
        value,
        notes: notes || '',
        timestamp: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'glucoseReadings'), readingData);

      return {
        ...readingData,
        id: docRef.id,
      } as GlucoseReading;
    } catch (error) {
      throw error;
    }
  },

  async getReadings(userId: string): Promise<GlucoseReading[]> {
    try {
      const q = query(
        collection(db, 'glucoseReadings'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const readings: GlucoseReading[] = [];

      querySnapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() } as GlucoseReading);
      });

      return readings;
    } catch (error) {
      throw error;
    }
  },

  async deleteReading(readingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'glucoseReadings', readingId));
    } catch (error) {
      throw error;
    }
  },
};
