# Expo Project Configuration Reference

## Assets

```
icon.png          1024×1024  App icon (all platforms)
splash.png        1024×1024  Splash screen image
adaptive-icon.png 1024×1024  Android adaptive icon foreground
favicon.png        64×64     Web favicon
```

Splash background color is set in `app.json` → `splash.backgroundColor` (e.g. `#1A2E6B`). Verify asset dimensions with `file assets/*.png` — wrong sizes surface at build time, not in TSC or expo-doctor.

## Permissions (app.json)

### iOS (`ios.infoPlist`)
```json
"infoPlist": {
  "NSCameraUsageDescription": "...",
  "NSPhotoLibraryUsageDescription": "...",
  "NSPhotoLibraryAddUsageDescription": "...",
  "NSFaceIDUsageDescription": "..."
}
```

### Android (`android.permissions`)
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.READ_MEDIA_IMAGES",
  "android.permission.VIBRATE",
  "android.permission.RECEIVE_BOOT_COMPLETED",
  "android.permission.INTERNET"
]
```

### Plugins array
Declare permission plugins so Expo's config plugin injects the rights at build time:
```json
"plugins": [
  "expo-asset",
  "expo-notifications",
  ["expo-camera", { "cameraPermission": "..." }],
  ["expo-local-authentication", { "faceIDPermission": "..." }]
]
```

**Install the package after declaring it:**
```bash
npx expo install expo-camera expo-local-authentication
```
Declaring in `app.json` alone is not sufficient — `expo-doctor` flags the missing peer dependency and the native build fails at the module link step.

## Bundle identifiers

```json
"ios": { "bundleIdentifier": "com.anypay.app" },
"android": { "package": "com.anypay.app" }
```

Keep iOS and Android identifiers consistent. Update both when changing the app's package name.

## CI/CD — GitHub Actions + EAS

Template already written to `.github/workflows/ci.yml` in this project.

Required project prerequisites:
- `package.json` has a `test` script that runs Jest.
- `jest.config.js` is valid CJS (`module.exports = {...}`).
- `eas.json` exists with a `preview` profile.
- Repo has an `EXPO_TOKEN` secret (create at expo.dev/account/settings/tokens).

Quality gates run on every push/PR; EAS preview builds run only on PRs.
