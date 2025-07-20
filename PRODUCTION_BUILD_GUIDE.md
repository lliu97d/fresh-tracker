# FreshTracker Production Build Guide

This guide outlines the steps required to create production builds for the FreshTracker React Native app using Expo EAS Build.

## 📋 Prerequisites

### Required Accounts
- **Expo Account** (free) - https://expo.dev
- **Apple Developer Account** ($99/year) - For iOS builds and App Store distribution
- **Google Play Console Account** (free) - For Android builds and Play Store distribution

### Required Tools
- **Node.js** (v18 or higher)
- **EAS CLI** - Expo's build service command line tool
- **Git** - For version control

## 🚀 Setup Steps

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo/EAS
```bash
eas login
```
*Note: This logs you into both Expo and EAS services using the same account*

### 3. Configure EAS Build
```bash
eas build:configure
```
This will:
- Create an EAS project for your app (requires EAS account)
- Generate an `eas.json` configuration file
- Configure your project for EAS Build

### 4. Verify Configuration
Ensure your `eas.json` file looks like this:
```json
{
  "cli": {
    "version": ">= 16.17.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 📱 Platform-Specific Build Instructions

### iOS Production Build

#### Requirements
- **Paid Apple Developer Account** ($99/year)
- **Apple ID** with access to Apple Developer Portal
- **App Store Connect** access

#### Build Command
```bash
eas build --platform ios --profile production
```

#### Process
1. EAS CLI will prompt for Apple Developer credentials
2. Enter your Apple ID and password
3. Complete 2FA verification if enabled
4. EAS will automatically:
   - Generate necessary certificates and provisioning profiles
   - Build your app for iOS
   - Provide a download link when complete

#### Distribution
- **App Store**: Use `eas submit --platform ios` to upload to App Store Connect
- **TestFlight**: Automatically available after App Store submission
- **Direct Distribution**: Download the `.ipa` file and distribute manually

### Android Production Build

#### Requirements
- **Google Play Console Account** (free)
- **Google Play Developer Account** ($25 one-time fee for Play Store publishing)

#### Build Command
```bash
eas build --platform android --profile production
```

#### Process
1. EAS CLI will handle Android credentials automatically
2. Build process runs on Expo's servers
3. Provides a download link for the `.apk` or `.aab` file

#### Distribution
- **Play Store**: Use `eas submit --platform android` to upload to Play Store
- **Direct Distribution**: Download the `.apk` file and distribute manually

### Web Production Build

#### Requirements
- None (free)

#### Build Command
```bash
expo export --platform web
```

#### Process
1. Generates static files in the `web-build` directory
2. Can be deployed to any static hosting service

#### Distribution
- **Vercel**: `npx vercel web-build`
- **Netlify**: Upload `web-build` folder
- **GitHub Pages**: Push `web-build` to gh-pages branch
- **Any static hosting**: Upload files to your preferred service

## 🔧 Alternative Build Options

### Development Builds (No Paid Account Required)
```bash
# iOS Development Build
eas build --platform ios --profile development

# Android Development Build
eas build --platform android --profile development
```

### Preview Builds (Internal Testing)
```bash
# iOS Preview Build
eas build --platform ios --profile preview

# Android Preview Build
eas build --platform android --profile preview
```

## 📦 Build Profiles Explained

### Development Profile
- **Purpose**: Testing with development client
- **Features**: Hot reload, debugging tools
- **Distribution**: Internal only
- **Requirements**: None

### Preview Profile
- **Purpose**: Internal testing and beta distribution
- **Features**: Production-like environment
- **Distribution**: Internal only
- **Requirements**: None

### Production Profile
- **Purpose**: App store distribution
- **Features**: Optimized, release-ready
- **Distribution**: App stores
- **Requirements**: Paid accounts for iOS/Android

## 🛠️ Troubleshooting

### Common Issues

#### iOS Build Failures
- **"No team associated"**: Need paid Apple Developer account
- **Certificate issues**: EAS handles this automatically
- **Provisioning profile errors**: Usually resolved by EAS

#### Android Build Failures
- **Keystore issues**: EAS manages this automatically
- **Permission errors**: Check `app.json` permissions
- **Version conflicts**: Ensure consistent versioning

#### General Build Issues
- **Network errors**: Check internet connection
- **Timeout errors**: Retry the build
- **Dependency issues**: Run `npm install` before building

### Environment Variables
If your app uses environment variables:
1. Set them in EAS dashboard
2. Or use `eas secret:create` command
3. Reference them in your code

## 📊 Build Monitoring

### Check Build Status
```bash
eas build:list
```

### View Build Logs
```bash
eas build:view [BUILD_ID]
```

### Cancel Build
```bash
eas build:cancel [BUILD_ID]
```

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm install -g eas-cli
      - run: eas build --platform all --profile production --non-interactive
```

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://play.google.com/about/developer-content-policy/)
- [Expo Documentation](https://docs.expo.dev/)

## 🎯 Quick Reference Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for all platforms
eas build --platform all --profile production

# Build for specific platform
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android

# Check build status
eas build:list
```

## ⚠️ Important Notes

1. **EAS account is required for all cloud builds** (same as Expo account)
2. **iOS builds require a paid Apple Developer account**
3. **Android builds are free but Play Store publishing requires a one-time $25 fee**
4. **Web builds are completely free**
5. **Always test builds before submitting to app stores**
6. **Keep your EAS CLI updated for the latest features**
7. **Monitor build quotas and limits on your EAS account**

---

*Last updated: July 2025*
*FreshTracker v1.0.0* 