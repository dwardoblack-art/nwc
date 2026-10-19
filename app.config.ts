import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = process.env.EXPO_PUBLIC_APP_ID ?? "com.nwcargo.app";
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const bundleId = rawBundleId
  .replace(/[-_]/g, ".")
  .replace(/[^a-zA-Z0-9.]/g, "")
  .replace(/\.+/g, ".")
  .replace(/^\.+|\.+$/g, "")
  .toLowerCase();

const env = {
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? "Newworld Cargo",
  appSlug: process.env.EXPO_PUBLIC_APP_SLUG ?? "nwcargo-mobile",
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? "nwcargo",
  version: process.env.EXPO_PUBLIC_APP_VERSION ?? "1.0.0",
  runtimeVersion: process.env.EXPO_PUBLIC_RUNTIME_VERSION ?? "1.0.0",
  iosBuildNumber: process.env.EXPO_PUBLIC_IOS_BUILD_NUMBER ?? "1",
  androidVersionCode: Number(
    process.env.EXPO_PUBLIC_ANDROID_VERSION_CODE ?? "1",
  ),
  iosBundleId: bundleId,
  androidPackage: bundleId,
  expoProjectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: env.version,
  runtimeVersion: env.runtimeVersion,
  orientation: "portrait",
  icon: "./assets/images/launcher-yellow.png",
  scheme: Array.from(new Set([env.scheme, "nwcargo", "newworldcargo"])),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    buildNumber: env.iosBuildNumber,
    config: googleMapsApiKey ? { googleMapsApiKey } : undefined,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        "Allow Newworld Cargo to attach cargo evidence photos.",
      NSPhotoLibraryUsageDescription:
        "Allow Newworld Cargo to select profile photos and support evidence.",
      NSLocationWhenInUseUsageDescription:
        "Allow Newworld Cargo to help choose pickup and delivery locations.",
      NSContactsUsageDescription:
        "Allow Newworld Cargo to fill delivery contact details from your phone contacts.",
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#FFC83D",
      foregroundImage: "./assets/images/launcher-foreground.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    versionCode:
      Number.isFinite(env.androidVersionCode) && env.androidVersionCode > 0
        ? env.androidVersionCode
        : 1,
    config: googleMapsApiKey
      ? { googleMaps: { apiKey: googleMapsApiKey } }
      : undefined,
    permissions: [
      "POST_NOTIFICATIONS",
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_CONTACTS",
    ],
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.WRITE_CONTACTS",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          ...Array.from(new Set([env.scheme, "nwcargo", "newworldcargo"]), (scheme) => ({ scheme })),
          { scheme: "https", host: "app.newworldcargo.com" },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    eas: env.expoProjectId ? { projectId: env.expoProjectId } : undefined,
  },
  plugins: [
    [
      "expo-image-picker",
      {
        cameraPermission:
          "Allow Newworld Cargo to scan shipment labels and attach cargo evidence.",
        microphonePermission: false,
      },
    ],
    "@react-native-community/datetimepicker",
    "expo-router",
    "expo-font",
    "expo-video",
    "expo-web-browser",
    ["expo-audio", { microphonePermission: false, recordAudioAndroid: false }],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to securely access your Newworld Cargo account.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/launcher-foreground.png",
        imageWidth: 360,
        resizeMode: "contain",
        backgroundColor: "#FFC83D",
        dark: { backgroundColor: "#FFC83D" },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
          compileSdkVersion: 36,
          targetSdkVersion: 36,
        },
      },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
