import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { setMeals } from '../store/slices/mealsSlice';
import { mealService } from '../services/mealService';

export default function DashboardScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const meals = useAppSelector((state) => state.meals.meals);
  const glucose = useAppSelector((state) => state.glucose.readings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      loadMeals();
    }
  }, [user]);

  const loadMeals = async () => {
    try {
      if (user) {
        const mealData = await mealService.getMeals(user.uid);
        dispatch(setMeals(mealData));
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    const today = new Date();
    return (
      mealDate.toDateString() === today.toDateString()
    );
  });

  const todayGlucose = glucose.filter((reading) => {
    const readingDate = new Date(reading.timestamp);
    const today = new Date();
    return (
      readingDate.toDateString() === today.toDateString()
    );
  });

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.displayName || 'User'}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Today's Calories</Text>
          <Text style={styles.statValue}>{totalCalories}</Text>
          <Text style={styles.statUnit}>kcal</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Meals Logged</Text>
          <Text style={styles.statValue}>{todayMeals.length}</Text>
          <Text style={styles.statUnit}>meals</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Glucose Readings</Text>
          <Text style={styles.statValue}>{todayGlucose.length}</Text>
          <Text style={styles.statUnit}>readings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        {todayMeals.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged yet today</Text>
        ) : (
          <FlatList
            data={todayMeals}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.mealItem}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealCalories}>{item.calories} kcal</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statUnit: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealCalories: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
