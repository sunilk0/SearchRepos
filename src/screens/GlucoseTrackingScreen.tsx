import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addReading } from '../store/slices/glucoseSlice';
import { glucoseService } from '../services/glucoseService';

export default function GlucoseTrackingScreen() {
  const [glucoseValue, setGlucoseValue] = useState('');
  const [notes, setNotes] = useState('');

  const user = useAppSelector((state) => state.auth.user);
  const readings = useAppSelector((state) => state.glucose.readings);
  const dispatch = useAppDispatch();

  const handleAddReading = async () => {
    if (!glucoseValue) {
      Alert.alert('Error', 'Please enter glucose value');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const value = parseInt(glucoseValue);
      if (value < 40 || value > 500) {
        Alert.alert('Error', 'Glucose value should be between 40 and 500 mg/dL');
        return;
      }

      const newReading = await glucoseService.addReading(user.uid, value, notes);
      dispatch(addReading(newReading));

      setGlucoseValue('');
      setNotes('');

      Alert.alert('Success', 'Glucose reading logged successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const todayReadings = readings.filter((reading) => {
    const readingDate = new Date(reading.timestamp);
    const today = new Date();
    return readingDate.toDateString() === today.toDateString();
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Glucose Tracking</Text>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Glucose Value (mg/dL) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 120"
            value={glucoseValue}
            onChangeText={setGlucoseValue}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="e.g., Before breakfast"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddReading}>
          <Text style={styles.buttonText}>Log Reading</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Readings ({todayReadings.length})</Text>
        {todayReadings.length === 0 ? (
          <Text style={styles.emptyText}>No readings logged yet today</Text>
        ) : (
          <FlatList
            data={todayReadings}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.readingItem}>
                <View>
                  <Text style={styles.readingValue}>{item.value} mg/dL</Text>
                  <Text style={styles.readingTime}>{formatTime(item.timestamp)}</Text>
                  {item.notes && <Text style={styles.readingNotes}>{item.notes}</Text>}
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        item.value < 100
                          ? '#4CAF50'
                          : item.value < 140
                          ? '#FFC107'
                          : '#F44336',
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.value < 100 ? 'Low' : item.value < 140 ? 'Normal' : 'High'}
                  </Text>
                </View>
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
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  readingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  readingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  readingTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  readingNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
