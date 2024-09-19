export interface AppConfig {
  PLAY_STORE_ID?: string;
  APP_STORE_ID?: string;
}

export const SUPPORTED_DOMAINS = {
  YOUTUBE: "youtube.com",
  YOUTU_BE: "youtu.be",
  FACEBOOK: "facebook.com",
  GOOGLE_PLAY_STORE: "play.google.com",
  APPLE_APP_STORE: "apps.apple.com",
  INSTAGRAM: "instagram.com",
  TWITTER: "twitter.com",
  X: "x.com",
  LINKEDIN: "linkedin.com",
} as const;

export const APPS = {
  [SUPPORTED_DOMAINS.YOUTUBE]: {
    PLAY_STORE_ID: "com.google.android.youtube",
    APP_STORE_ID: "id544007664",
  },
  [SUPPORTED_DOMAINS.YOUTU_BE]: {
    PLAY_STORE_ID: "com.google.android.youtube",
    APP_STORE_ID: "id544007664",
  },
  [SUPPORTED_DOMAINS.FACEBOOK]: {
    PLAY_STORE_ID: "com.facebook.katana",
    APP_STORE_ID: "id284882215",
  },
  [SUPPORTED_DOMAINS.GOOGLE_PLAY_STORE]: {
    PLAY_STORE_ID: "com.android.vending",
    APP_STORE_ID: "",
  },
  [SUPPORTED_DOMAINS.APPLE_APP_STORE]: {
    PLAY_STORE_ID: "",
    APP_STORE_ID: "",
  },
  [SUPPORTED_DOMAINS.INSTAGRAM]: {
    PLAY_STORE_ID: "com.instagram.android",
    APP_STORE_ID: "id389801252",
  },
  [SUPPORTED_DOMAINS.TWITTER]: {
    PLAY_STORE_ID: "com.twitter.android",
    APP_STORE_ID: "id333903271",
  },
  [SUPPORTED_DOMAINS.X]: {
    PLAY_STORE_ID: "com.twitter.android",
    APP_STORE_ID: "id333903271",
  },
  [SUPPORTED_DOMAINS.LINKEDIN]: {
    PLAY_STORE_ID: "com.linkedin.android",
    APP_STORE_ID: "id828256236",
  },
};
