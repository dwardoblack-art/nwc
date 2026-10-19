import { describe, expect, it } from "vitest";
import fs from "node:fs";
import config from "../app.config";
import eas from "../eas.json";
import pkg from "../package.json";

describe("mobile release configuration", () => {
  it("builds a store AAB targeting API 36 without broad media or unused sensitive permissions", () => {
    expect(eas.build.production.distribution).toBe("store");
    expect(eas.build.production.android.buildType).toBe("app-bundle");
    const buildProperties = config.plugins?.find(
      (plugin) =>
        Array.isArray(plugin) && plugin[0] === "expo-build-properties",
    );
    expect(buildProperties).toEqual([
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
          compileSdkVersion: 36,
          targetSdkVersion: 36,
        },
      },
    ]);
    expect(config.android?.blockedPermissions).toEqual(
      expect.arrayContaining([
        "android.permission.RECORD_AUDIO",
        "android.permission.WRITE_CONTACTS",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
      ]),
    );
  });
  it("uses Newworld Cargo production-ready identifiers by default", () => {
    expect(config.name).toBe("Newworld Cargo");
    expect(config.slug).toBe("nwcargo-mobile");
    expect(config.scheme).toEqual(
      expect.arrayContaining(["nwcargo", "newworldcargo"]),
    );
    expect(config.version).toBe("1.0.0");
    expect(config.runtimeVersion).toBe("1.0.0");
    expect(config.ios?.bundleIdentifier).toBe("com.nwcargo.app");
    expect(config.ios?.buildNumber).toBe("1");
    expect(config.android?.package).toBe("com.nwcargo.app");
    expect(config.android?.versionCode).toBe(1);
  });

  it("declares native permission copy for production app review", () => {
    expect(config.ios?.infoPlist).toMatchObject({
      NSCameraUsageDescription: expect.stringContaining("cargo evidence"),
      NSPhotoLibraryUsageDescription: expect.stringContaining("profile photos"),
      NSLocationWhenInUseUsageDescription: expect.stringContaining(
        "pickup and delivery",
      ),
    });
    expect(config.android?.permissions).toEqual(
      expect.arrayContaining([
        "POST_NOTIFICATIONS",
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ]),
    );
  });

  it("passes the configured Google Maps key to both native platforms", () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY) return;
    expect(config.ios?.config?.googleMapsApiKey).toBe(
      process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    );
    expect(config.android?.config?.googleMaps?.apiKey).toBe(
      process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    );
  });

  it("keeps every build profile on live Laravel services", () => {
    for (const profile of [
      eas.build.preview,
      eas.build.staging,
      eas.build.production,
    ]) {
      expect(profile.env.EXPO_PUBLIC_API_MODE).toBe("laravel");
      expect(profile.env.EXPO_PUBLIC_API_BASE_URL).toBe(
        "https://api.newworldcargo.com/api/v1/",
      );
      expect(profile.env.EXPO_PUBLIC_PUBLIC_TRACKING_BASE_URL).toBe(
        "https://api.newworldcargo.com/api/v1/",
      );
      expect(profile.env.EXPO_PUBLIC_ADMIN_API_BASE_URL).toBe(
        "https://admin.newworldcargo.com/api/v1/",
      );
      expect(profile.env.EXPO_PUBLIC_MAPS_PROVIDER).toBe("native");
      expect(profile.env.EXPO_PUBLIC_PAYMENTS_PROVIDER).toBe("laravel");
    }
  });

  it("exposes standard build and audit scripts", () => {
    expect(pkg.scripts.quality).toBe("node scripts/mobile-quality.mjs");
    expect(pkg.scripts["release:audit"]).toBe(
      "node scripts/mobile-release-audit.mjs",
    );
    expect(pkg.scripts["build:preview:android"]).toBe(
      "eas build --profile preview --platform android",
    );
    expect(pkg.scripts["build:staging:android"]).toBe(
      "eas build --profile staging --platform android",
    );
    expect(pkg.scripts["build:production:android"]).toBe(
      "eas build --profile production --platform android",
    );
    expect(pkg.scripts["build:production:ios"]).toBe(
      "eas build --profile production --platform ios",
    );
  });

  it("does not keep unused Expo template artwork in release assets", () => {
    expect(fs.existsSync("assets/images/react-logo.png")).toBe(false);
    expect(fs.existsSync("assets/images/react-logo@2x.png")).toBe(false);
    expect(fs.existsSync("assets/images/react-logo@3x.png")).toBe(false);
    expect(fs.existsSync("assets/images/partial-react-logo.png")).toBe(false);
    expect(fs.existsSync("assets/images/splash-icon.png")).toBe(false);
  });

  it("declares customer deep-link routes for native and web links", () => {
    expect(config.android?.intentFilters?.[0]).toMatchObject({
      action: "VIEW",
      autoVerify: true,
      category: ["BROWSABLE", "DEFAULT"],
      data: expect.arrayContaining([
        { scheme: "nwcargo" },
        { scheme: "newworldcargo" },
        { scheme: "https", host: "app.newworldcargo.com" },
      ]),
    });
  });
});
