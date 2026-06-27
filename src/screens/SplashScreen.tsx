import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUser, setLoading } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));
      
      try {
        // Try to get stored user first
        const storedUser = await authService.getStoredUser();
        if (storedUser) {
          dispatch(setUser(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();

    // Also set up auth state listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
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
