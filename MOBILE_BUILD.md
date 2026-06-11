# VoiceGym — Mobile Build Guide

## Overview

VoiceGym uses [Capacitor](https://capacitorjs.com/) to wrap the Next.js static export into
native iOS and Android apps. The web assets are built into the `out/` folder and then copied
into the native Xcode/Android Studio projects.

---

## Prerequisites

### All platforms
- Node.js 18+
- `npm run build` produces a clean `out/` folder (static export)

### iOS (requires macOS)
- macOS 13+
- Xcode 15+ (download from Mac App Store)
- Apple Developer account (for device testing and App Store submission)
- CocoaPods: `sudo gem install cocoapods`

### Android
- Android Studio (latest stable — download from developer.android.com)
- Android SDK + Build Tools (installed via Android Studio)
- Java 17+ (bundled with Android Studio)

---

## Environment Variables

The native app has no backend server. API calls go to the production Vercel deployment.
Set this environment variable **before** building for mobile:

```
NEXT_PUBLIC_API_BASE_URL=https://voicegym-app.vercel.app
```

Create a `.env.mobile` file (not committed):
```
NEXT_PUBLIC_API_BASE_URL=https://voicegym-app.vercel.app
```

Then reference it during build:
```bash
# Windows PowerShell
$env:NEXT_PUBLIC_API_BASE_URL="https://voicegym-app.vercel.app"
npm run cap:build

# macOS / Linux
NEXT_PUBLIC_API_BASE_URL=https://voicegym-app.vercel.app npm run cap:build
```

---

## Build Commands

| Command | What it does |
|---|---|
| `npm run build` | Static export to `out/` (also used for Vercel) |
| `npm run cap:build` | Build + sync web assets to both native projects |
| `npm run cap:ios` | Build, sync, then open Xcode |
| `npm run cap:android` | Build, sync, then open Android Studio |
| `npx cap sync` | Sync web assets only (no rebuild) |
| `npx cap open ios` | Open Xcode (macOS only) |
| `npx cap open android` | Open Android Studio |

---

## Building for iOS

1. **Build web assets:**
   ```bash
   npm run cap:ios
   ```
   This builds the Next.js static export, syncs to `ios/`, and opens Xcode.

2. **In Xcode:**
   - Select the `App` scheme
   - Choose your target device or simulator
   - Press `⌘ + R` to run, or `⌘ + B` to build only

3. **Code signing:**
   - In Xcode → Targets → App → Signing & Capabilities
   - Set your Team (Apple Developer account)
   - Bundle Identifier: `com.alirezagoodarzi.voicegym`

4. **Run on a real device:**
   - Connect iPhone via USB
   - Trust the device in Xcode
   - Select the device as destination and run

---

## Submitting to the App Store (iOS)

1. **Archive the app:**
   - Xcode → Product → Archive
   - Wait for the archive to complete

2. **Distribute:**
   - In the Organizer window, select the archive
   - Click "Distribute App" → App Store Connect
   - Follow the upload wizard

3. **App Store Connect:**
   - Log in at [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Create a new app with Bundle ID `com.alirezagoodarzi.voicegym`
   - Fill in metadata (screenshots, description, keywords)
   - Submit for review (typically 1–3 days)

---

## Building for Android

1. **Build web assets:**
   ```bash
   npm run cap:android
   ```
   This builds the Next.js static export, syncs to `android/`, and opens Android Studio.

2. **In Android Studio:**
   - Click "Run" (green play button) to launch on an emulator or connected device
   - Use Build → Generate Signed Bundle / APK for release builds

3. **Enable USB Debugging on your device:**
   - Settings → About Phone → tap "Build Number" 7 times
   - Settings → Developer Options → USB Debugging

---

## Submitting to Google Play (Android)

1. **Generate a signed AAB (Android App Bundle):**
   - Android Studio → Build → Generate Signed Bundle / APK
   - Select "Android App Bundle" (`.aab`)
   - Create or use existing keystore (keep this file safe — you cannot re-sign without it)
   - Build type: `release`

2. **Google Play Console:**
   - Log in at [play.google.com/console](https://play.google.com/console)
   - Create a new app with package name `com.alirezagoodarzi.voicegym`
   - Fill in store listing (screenshots, description, privacy policy)
   - Upload the `.aab` to the Internal Testing → Closed Testing → Production track
   - Submit for review (typically 1–7 days for new apps)

---

## App Icon

The `public/icon.svg` file contains the VoiceGym icon (VG initials in lime on dark green).

To generate production-quality icons for both stores, use one of these tools:

- **[Capacitor Assets](https://github.com/ionic-team/capacitor-assets):** `npx @capacitor/assets generate`
  - Provide a 1024×1024 PNG at `resources/icon.png`
  - Run: `npx @capacitor/assets generate --iconBackgroundColor '#2D6A4F' --splashBackgroundColor '#2D6A4F'`
- **[AppIconGenerator.net](https://appicon.co):** Upload a 1024×1024 PNG and download all sizes
- **Figma / Sketch:** Export the SVG as 1024×1024 PNG, then use one of the above tools

---

## Permissions Required

### Microphone (for voice input)
Both platforms require microphone permission. Capacitor requests it automatically when
the Web Speech API is first used. No additional plugin needed.

**iOS** — Add to `ios/App/App/Info.plist` if not present:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>VoiceGym uses the microphone to capture your exercise commands.</string>
```

**Android** — Already included in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```

---

## Voice Recognition Note

The Web Speech API (`webkitSpeechRecognition`) is used for voice capture. This is
supported in WebKit-based browsers (Safari / WKWebView) and Chromium (Android WebView).
It works natively on both iOS (WKWebView) and Android (WebView).

---

## Troubleshooting

| Problem | Solution |
|---|---|
| API calls fail in native app | Set `NEXT_PUBLIC_API_BASE_URL=https://voicegym-app.vercel.app` before building |
| White screen on launch | Check that `out/` is populated: run `npm run build` first |
| Microphone not working | Add `NSMicrophoneUsageDescription` to iOS Info.plist |
| `npx cap sync` fails | Ensure `out/index.html` exists (run `npm run build` first) |
| Android build fails | Ensure Android SDK is installed; open in Android Studio and let Gradle sync |
