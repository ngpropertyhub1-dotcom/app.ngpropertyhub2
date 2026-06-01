# Building Android APK with Capacitor

## Prerequisites

### Required Software
1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **Java Development Kit (JDK)** (v17+)
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
3. **Android Studio** - [Download](https://developer.android.com/studio)
4. **Gradle** (usually included with Android Studio)

### Environment Setup

#### On Windows:
```bash
# Set JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
setx PATH %PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

#### On macOS/Linux:
```bash
# Add to ~/.zshrc or ~/.bashrc
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
```

## Step 1: Install Dependencies

```bash
bun install
```

## Step 2: Build Web Assets

```bash
bun run build
```

This creates the `dist/` folder with optimized web files.

## Step 3: Initialize Capacitor (First Time Only)

```bash
bun run cap:init
```

When prompted:
- App name: `Property Hub USA`
- App Package ID: `com.ngpropertyhub.app`
- Web asset directory: `dist`
- API or native target: Choose `Android`

## Step 4: Add Android Platform

```bash
bun run cap:add:android
```

This creates the `android/` folder with native Android project files.

## Step 5: Sync Code

```bash
bun run cap:sync
```

This syncs web assets to the Android project.

## Step 6: Build APK

### Option A: Build from Command Line

```bash
bun run cap:build:android
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Option B: Build from Android Studio (GUI)

```bash
bun run cap:open:android
```

This opens the Android Studio IDE. Then:
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. APK will be in `android/app/build/outputs/apk/release/`

## Step 7: Install on Device/Emulator

```bash
# List connected devices
adb devices

# Install APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

Or drag & drop the APK onto an Android emulator.

## Signing the APK (For Release)

### Generate Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

### Sign APK with Android Studio
1. Open Android Studio
2. **Build** → **Generate Signed Bundle/APK**
3. Select your keystore
4. Complete the signing process

## Troubleshooting

### "ANDROID_HOME not set"
- Set environment variables (see setup above)
- Restart your terminal/IDE

### "SDK Platform not found"
- Open Android Studio
- **SDK Manager** → Install "Android 13" or higher

### "Gradle build failed"
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build
cd ..
```

### "APK too large"
- Enable ProGuard/R8 minification in `android/app/build.gradle`
- Remove unused dependencies

## Output Files

After successful build:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

Debug APK is for testing, Release APK is for distribution.

## Distribution

### Play Store
1. Generate signed APK or AAB
2. Create Google Play Developer account
3. Upload to Play Console
4. Submit for review

### Direct Distribution
- Share the signed APK file
- Users can sideload on their Android devices
- Users must enable "Unknown Sources" in Settings

## Quick Commands

```bash
# Full build pipeline
bun run android:build

# Just sync (after web changes)
bun run cap:sync

# Open in Android Studio
bun run cap:open:android
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Gradle Documentation](https://gradle.org/)
