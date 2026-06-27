# Health Tracker React Native App

A comprehensive health tracking application built with React Native, Expo, Firebase, and Redux.

## Features

### Phase 1 (Complete) ✅
- Expo setup with TypeScript
- Firebase authentication (email/password)
- Redux store with authentication, meals, and glucose slices
- Tab-based navigation (Dashboard, Meals, Glucose, Profile)
- Core screens with basic UI

### Phase 2 (In Progress) 🔄
- Google Sign-In authentication
- Auth state persistence with AsyncStorage
- Improved error handling and validation
- Loading states and indicators
- Email validation

### Phase 3-6 (Planned)
- Barcode scanning for food items
- AI meal suggestions
- Premium features and in-app purchases
- Charts and analytics
- Deployment to TestFlight and Google Play

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Xcode) or Android Emulator

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Email/Password authentication
   - Google Sign-In
4. Create a Firestore database in production mode
5. Copy your Firebase config and add to `.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Client):
   - Authorized redirect URIs: `https://auth.expo.io/@username/project`
5. Copy the Web Client ID to `.env.local`:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

### 3. Installation

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase initialization
├── screens/
│   ├── SplashScreen.tsx     # Auth initialization
│   ├── SignInScreen.tsx     # Email/Google sign-in
│   ├── SignUpScreen.tsx     # Email/Google sign-up
│   ├── DashboardScreen.tsx  # Home page with stats
│   ├── MealLoggingScreen.tsx    # Log meals
│   ├── GlucoseTrackingScreen.tsx # Track glucose
│   └── ProfileScreen.tsx    # User profile
├── services/
│   ├── authService.ts       # Firebase auth logic
│   ├── mealService.ts       # Firestore meal CRUD
│   └── glucoseService.ts    # Firestore glucose CRUD
├── store/
│   ├── index.ts             # Redux store config
│   └── slices/
│       ├── authSlice.ts     # Auth state
│       ├── mealsSlice.ts    # Meals state
│       └── glucoseSlice.ts  # Glucose state
├── types/
│   └── index.ts             # TypeScript interfaces
├── navigation/
│   └── index.tsx            # Stack & Tab navigation
└── hooks/
    └── useAppDispatch.ts    # Redux hooks
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=

# External APIs (for future phases)
EXPO_PUBLIC_NUTRITIONIX_APP_ID=
EXPO_PUBLIC_NUTRITIONIX_APP_KEY=
EXPO_PUBLIC_OPENAI_API_KEY=
```

## Development

### Available Commands

```bash
# Start dev server
npm start

# Run iOS
npm run ios

# Run Android
npm run android

# Run web
npm run web

# Type checking
npm run tsc

# Linting (if configured)
npm run lint
```

### Firebase Firestore Rules

Make sure to set up appropriate security rules in Firestore:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Meals collection
    match /meals/{meal} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    // Glucose readings collection
    match /glucoseReadings/{reading} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Testing

### Test Firebase Connection
1. Sign up with email/password or Google
2. Check Firebase Console to verify user creation
3. Log a meal and glucose reading
4. Verify data appears in Firestore

### Test Auth Persistence
1. Sign in to the app
2. Close the app completely
3. Reopen the app - should be still logged in
4. Test sign out and verify auth state clears

## Troubleshooting

### Google Sign-In Not Working
- Verify Google Web Client ID is set in `.env.local`
- Check OAuth consent screen is configured in Google Cloud Console
- Ensure authorized redirect URIs include your Expo app

### Firebase Connection Issues
- Verify Firebase config is correct in `.env.local`
- Check firestore security rules allow your user to read/write
- Ensure Firebase is initialized before auth state listener runs

### Build Issues
- Clear cache: `expo start --clear`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Prebuild: `expo prebuild --clean`

## Next Steps

- [ ] Add barcode scanner for food items
- [ ] Integrate AI meal suggestions API
- [ ] Create charts for glucose and calorie trends
- [ ] Implement in-app purchases for premium features
- [ ] Add push notifications
- [ ] Build and deploy to TestFlight/Google Play

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
