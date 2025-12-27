# Android Deployment Guide

Your Sudoku app has been converted into an Android project using Capacitor!

## Prerequisite
- **Android Studio** must be installed on your computer.

## Steps to Build APK / AAB

1. **Open the Project**
   Run the following command in your terminal:
   ```bash
   npx cap open android
   ```
   This will launch Android Studio with your project loaded.

2. **Wait for Sync**
   Android Studio will automatically start syncing Gradle files (downloading dependencies). Wait for this process to finish (look at the bottom status bar).

3. **Build Signed Bundle (for Play Store)**
   - Go to **Build** > **Generate Signed Bundle / APK**.
   - Select **Android App Bundle** (Required for new apps on Play Store) or **APK** (for testing on your own device).
   - Click **Next**.
   - **Key Store Path**: Click "Create new..." to make a signing key (keep this file safe!).
   - Fill in the required password and certificate details.
   - Click **Next**, select **Release**, and click **Create**.

4. **Locate the File**
   Once built, Android Studio will show a notification "Generate Signed Bundle". Click "locate" to find your `.aab` or `.apk` file.

5. **Upload**
   Take the `.aab` file and upload it to the Google Play Console!

## Testing on Emulator/Device
You can also just click the green "Play" (Run) button in Android Studio to launch the app on a connected emulator or USB device.
