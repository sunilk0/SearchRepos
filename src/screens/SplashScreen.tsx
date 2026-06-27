import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
