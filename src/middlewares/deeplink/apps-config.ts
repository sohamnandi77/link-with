export interface AppConfig {
  DOMAIN: string;
  PLAY_STORE_ID?: string;
  APP_STORE_ID?: string;
}

export const APPS = {
  YOUTUBE: {
    DOMAIN: "youtube.com",
    PLAY_STORE_ID: "com.google.android.youtube",
    APP_STORE_ID: "id544007664",
  },
  YOUTU_BE: {
    DOMAIN: "youtu.be",
    PLAY_STORE_ID: "com.google.android.youtube",
    APP_STORE_ID: "id544007664",
  },
  FACEBOOK: {
    DOMAIN: "facebook.com",
    PLAY_STORE_ID: "com.facebook.katana",
    APP_STORE_ID: "id284882215",
  },
  GOOGLE_PLAYSTORE: {
    DOMAIN: "play.google.com",
    PLAY_STORE_ID: "com.android.vending",
    APP_STORE_ID: "",
  },
  APPLE_APP_STORE: {
    DOMAIN: "apps.apple.com",
    PLAY_STORE_ID: "",
    APP_STORE_ID: "",
  },
  INSTAGRAM: {
    DOMAIN: "instagram.com",
    PLAY_STORE_ID: "com.instagram.android",
    APP_STORE_ID: "id389801252",
  },
  TWITTER: {
    DOMAIN: "twitter.com",
    PLAY_STORE_ID: "com.twitter.android",
    APP_STORE_ID: "id333903271",
  },
  X: {
    DOMAIN: "x.com",
    PLAY_STORE_ID: "com.twitter.android",
    APP_STORE_ID: "id333903271",
  },
  LINKEDIN: {
    DOMAIN: "linkedin.com",
    PLAY_STORE_ID: "com.linkedin.android",
    APP_STORE_ID: "id828256236",
  },
} as const;
