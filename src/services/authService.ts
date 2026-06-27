import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-google-app-auth';
import { auth, db } from '../config/firebase';
import { User } from '../types';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

export const authService = {
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile
      await updateProfile(firebaseUser, { displayName });

      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };

      // Store user data in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        lastLogin: serverTimestamp(),
      });

      // Store in AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        // Update last login
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          { lastLogin: serverTimestamp() },
          { merge: true }
        );

        // Store in AsyncStorage for persistence
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        return userData;
      }

      throw new Error('User data not found');
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  },

  async signInWithGoogle(): Promise<User> {
    try {
      if (!GOOGLE_WEB_CLIENT_ID) {
        throw new Error('Google Web Client ID is not configured');
      }

      const result = await Google.logInAsync({
        clientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type !== 'success') {
        throw new Error('Google sign-in was cancelled');
      }

      const { idToken, user: googleUser } = result;

      if (!idToken) {
        throw new Error('No ID token received');
      }

      // Sign in with Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Check if user exists in Firestore
      let userData: User;
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        // Create new user
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || googleUser.email || '',
          displayName: firebaseUser.displayName || googleUser.name || '',
          photoURL: firebaseUser.photoURL || googleUser.photoUrl || undefined,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userData,
          lastLogin: serverTimestamp(),
        });
      }

      // Update last login
      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );

      // Store in AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Google sign-in failed');
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('user');
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            callback(userData);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        await AsyncStorage.removeItem('user');
        callback(null);
      }
    });
  },
};
