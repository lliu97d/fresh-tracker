# FreshTracker

A React Native Expo app for tracking fresh food items, managing pantry inventory, and discovering recipes.

## Features

- 🍎 **Food Tracking**: Track fresh food items with expiration dates
- 🏠 **Pantry Management**: Organize pantry items and track quantities
- 📱 **Barcode Scanning**: Scan product barcodes for easy item entry
- 🍳 **Recipe Discovery**: Find recipes based on available ingredients
- 👤 **User Profiles**: Personalized experience with diet preferences
- 🔐 **Authentication**: Secure user accounts with Firebase
- 📊 **Smart Notifications**: Get alerts for expiring items

## Tech Stack

- **Frontend**: React Native with Expo
- **UI Framework**: Tamagui
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Local storage with persistence
- **API**: Spoonacular for recipes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fresh-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on iOS or Android:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Quick Testing with Dummy Users

The app includes mock authentication with pre-configured test accounts:

- **Soy Master**: `soy@freshtracker.com` / `SoySauce2024!`
- **Avocado Enthusiast**: `avocado@freshtracker.com` / `GuacamoleLover99!`

See `DUMMY_USERS.md` for detailed testing instructions.

## Project Structure

```
fresh-tracker/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── navigation/         # Navigation configuration
├── screens/           # App screens
├── services/          # API and external services
├── store/             # Zustand state management
├── testing/           # Test scripts and documentation
├── utils/             # Utility functions
└── assets/            # Images and static files
```

## Testing

The project includes a comprehensive testing suite located in the `testing/` directory.

### Running Tests

**Run all tests:**
```bash
node testing/run-all-tests.js
```

**Run a specific test:**
```bash
node testing/test-name.js
```

**Test categories:**
- Authentication & Navigation
- UI & Navigation
- Profile & Unlock functionality
- Fresh Foods Screen
- API & Error Handling

See `testing/README.md` for detailed test documentation.

## Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication
3. Update Firebase configuration in `services/firebase.ts`
4. See `FIREBASE_SETUP.md` for detailed instructions

### Recipe API Setup

1. Get a Spoonacular API key
2. Update the API key in `services/recipeAPI.ts`
3. See `RECIPE_API_SETUP.md` for detailed instructions

## Development

### Key Features Implemented

- ✅ Firebase authentication (login, signup, forgot password)
- ✅ Bottom tab navigation with safe area handling
- ✅ Food tracking with expiration management
- ✅ Pantry management
- ✅ Recipe API integration with error handling
- ✅ Sample content for unauthenticated users
- ✅ Unlock banners and profile content
- ✅ Performance optimizations (useCallback, memoization)
- ✅ Comprehensive testing suite

### Recent Fixes

- Fixed inline function warnings in React Navigation
- Resolved button functionality in Profile and Fresh Foods screens
- Improved tab navigation performance
- Enhanced error handling for API failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

This project is licensed under the MIT License. 