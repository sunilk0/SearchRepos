import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addMeal } from '../store/slices/mealsSlice';
import { mealService } from '../services/mealService';

export default function MealLoggingScreen() {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [barcode, setBarcode] = useState('');

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleAddMeal = async () => {
    if (!mealName || !calories) {
      Alert.alert('Error', 'Please enter meal name and calories');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const mealData = {
        id: '',
        userId: user.uid,
        name: mealName,
        calories: parseInt(calories),
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
        barcode: barcode || undefined,
        timestamp: new Date().toISOString(),
      };

      const newMeal = await mealService.addMeal(user.uid, mealData);
      dispatch(addMeal(newMeal));

      // Reset form
      setMealName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setBarcode('');

      Alert.alert('Success', 'Meal logged successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Meal</Text>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Meal Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Chicken Breast with Rice"
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Calories *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 450"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>Macronutrients (optional)</Text>

        <View style={styles.macrosContainer}>
          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Barcode (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Scanned barcode"
            value={barcode}
            onChangeText={setBarcode}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddMeal}>
          <Text style={styles.buttonText}>Log Meal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  flex: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
