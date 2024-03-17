const isProdBuild = process.env.EXPO_PUBLIC_BUILD_TYPE === "PROD";
const appIdentifier = isProdBuild ? "com.codejam.catadoro" : `com.codejam.catadoro_${process.env.EXPO_PUBLIC_BUILD_TYPE}`;

export default {
  "name": isProdBuild ? "Catadoro" : `Catadoro_${process.env.EXPO_PUBLIC_BUILD_TYPE}`,
  "slug": "Catadoro",
  "version": "1.1.8",
  "runtimeVersion": "1.1.3",
  "orientation": "portrait",
  "icon": "./assets/catadoro_icon.png",
  "userInterfaceStyle": "light",
  "splash": {
    "image": "./assets/catadoro_loading_screen.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.codejam.catadoro"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/app_icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": appIdentifier,
    "versionCode": 1,
    "permissions": [
      "android.permission.SCHEDULE_EXACT_ALARM"
    ]
  },
  "web": {
    "favicon": "./assets/app_icon.png"
  },
  "extra": {
    "eas": {
      "projectId": "b843c11e-43a9-4a80-856d-7ad38402c644"
    }
  },
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/notification_icon.png",
        "sounds": [
          "./assets/sounds/catadoro_notification_1.wav",
          "./assets/sounds/catadoro_notification_2.wav",
          "./assets/sounds/catadoro_notification_3.wav",
          "./assets/sounds/catadoro_notification_4.wav",
          "./assets/sounds/catadoro_notification_5.wav",
          "./assets/sounds/catadoro_notification_6.wav",
          "./assets/sounds/catadoro_notification_7.wav"
        ]
      }
    ],
    "expo-secure-store"
  ],
  "updates": {
    "url": "https://u.expo.dev/b843c11e-43a9-4a80-856d-7ad38402c644"
  }
}