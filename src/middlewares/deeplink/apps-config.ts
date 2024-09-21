export interface AppConfig {
  PLAY_STORE_ID?: string;
  APP_STORE_ID?: string;
}

export const SUPPORTED_DOMAINS = {
  AMAZON: "AMAZON",
  APPLE_APP_STORE: "APPLE_APP_STORE",
  DISCORD: "DISCORD",
  EVOLVE: "EVOLVE",
  FACEBOOK: "FACEBOOK",
  FLIPKART: "FLIPKART",
  GOOGLE_PLAY_STORE: "GOOGLE_PLAY_STORE",
  INSTAGRAM: "INSTAGRAM",
  LINKEDIN: "LINKEDIN",
  NETFLIX: "NETFLIX",
  PINTEREST: "PINTEREST",
  REDDIT: "REDDIT",
  SNAPCHAT: "SNAPCHAT",
  SPOTIFY: "SPOTIFY",
  SWIGGY: "SWIGGY",
  TELEGRAM: "TELEGRAM",
  TWITTER: "TWITTER",
  UBER: "UBER",
  WHATSAPP: "WHATSAPP",
  YOUTUBE: "YOUTUBE",
  ZOMATO: "ZOMATO",
  ZOOM: "ZOOM",

  //
  JIRA: "JIRA",
  NOTION: "NOTION",
  GMAIL: "GMAIL",
  HULU: "HULU",
  GITLAB: "GITLAB",
  BITBUCKET: "BITBUCKET",
  GITHUB: "GITHUB",
  MEDIUM: "MEDIUM",
  EVERNOTE: "EVERNOTE",
  PRIME_VIDEO: "PRIME_VIDEO",
  QUORA: "QUORA",
  CANVA: "CANVA",
  FIGMA: "FIGMA",
} as const;

export const DOMAIN_REGEX_MAP = new Map([
  [SUPPORTED_DOMAINS.AMAZON, /^(amazon\.(com|ca|co\.uk|in|es))$/],
  [SUPPORTED_DOMAINS.APPLE_APP_STORE, /^(apps\.apple\.com)$/],
  [SUPPORTED_DOMAINS.DISCORD, /^(discord\.com)$/],
  [SUPPORTED_DOMAINS.EVOLVE, /^(evolveinc\.app\.link|evolveinc\.io)$/],
  [SUPPORTED_DOMAINS.FACEBOOK, /^(facebook\.com)$/],
  [SUPPORTED_DOMAINS.FLIPKART, /^(flipkart\.com)$/],
  [SUPPORTED_DOMAINS.GOOGLE_PLAY_STORE, /^(play\.google\.com)$/],
  [SUPPORTED_DOMAINS.INSTAGRAM, /^(instagram\.com)$/],
  [SUPPORTED_DOMAINS.LINKEDIN, /^(linkedin\.com)$/],
  [SUPPORTED_DOMAINS.NETFLIX, /^(netflix\.com)$/],
  [SUPPORTED_DOMAINS.PINTEREST, /^(pinterest\.com)$/],
  [SUPPORTED_DOMAINS.REDDIT, /^(reddit\.com)$/],
  [SUPPORTED_DOMAINS.SNAPCHAT, /^(snapchat\.com)$/],
  [SUPPORTED_DOMAINS.SPOTIFY, /^(open\.spotify\.com)$/],
  [SUPPORTED_DOMAINS.SWIGGY, /^(swiggy\.com)$/],
  [SUPPORTED_DOMAINS.TELEGRAM, /^(t\.me)$/],
  [SUPPORTED_DOMAINS.TWITTER, /^(twitter\.com|x\.com)$/],
  [SUPPORTED_DOMAINS.UBER, /^(uber\.com)$/],
  [SUPPORTED_DOMAINS.WHATSAPP, /^(whatsapp\.com)$/],
  [SUPPORTED_DOMAINS.YOUTUBE, /^(youtube\.com|youtu\.be)$/],
  [SUPPORTED_DOMAINS.ZOMATO, /^(zomato\.com)$/],
  [SUPPORTED_DOMAINS.ZOOM, /^(zoom\.(us|com))$/],
  [SUPPORTED_DOMAINS.JIRA, /^(jira\.(com|atlassian\.net))$/],
  [SUPPORTED_DOMAINS.NOTION, /^(notion\.so)$/],
  [SUPPORTED_DOMAINS.GMAIL, /^(mail\.google\.com)$/],
  [SUPPORTED_DOMAINS.HULU, /^(hulu\.com)$/],
  [SUPPORTED_DOMAINS.GITLAB, /^(gitlab\.com)$/],
  [SUPPORTED_DOMAINS.BITBUCKET, /^(bitbucket\.org)$/],
  [SUPPORTED_DOMAINS.GITHUB, /^(github\.com)$/],
  [SUPPORTED_DOMAINS.MEDIUM, /^(medium\.com)$/],
  [SUPPORTED_DOMAINS.EVERNOTE, /^(evernote\.com)$/],
  [SUPPORTED_DOMAINS.PRIME_VIDEO, /^(primevideo\.com)$/],
  [SUPPORTED_DOMAINS.QUORA, /^(quora\.com)$/],
  [SUPPORTED_DOMAINS.CANVA, /^(canva\.com)$/],
  [SUPPORTED_DOMAINS.FIGMA, /^(figma\.com)$/],
]);

export const APPS = {
  [SUPPORTED_DOMAINS.YOUTUBE]: {
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
  [SUPPORTED_DOMAINS.LINKEDIN]: {
    PLAY_STORE_ID: "com.linkedin.android",
    APP_STORE_ID: "id828256236",
  },
  [SUPPORTED_DOMAINS.AMAZON]: {
    PLAY_STORE_ID: "in.amazon.mShop.android.shopping",
    APP_STORE_ID: "id1478350915",
  },
  [SUPPORTED_DOMAINS.FLIPKART]: {
    PLAY_STORE_ID: "com.flipkart.android",
    APP_STORE_ID: "id742044692",
  },
  [SUPPORTED_DOMAINS.SPOTIFY]: {
    PLAY_STORE_ID: "com.spotify.music",
    APP_STORE_ID: "id324684580",
  },
  [SUPPORTED_DOMAINS.TELEGRAM]: {
    PLAY_STORE_ID: "org.telegram.messenger",
    APP_STORE_ID: "id686449807",
  },
  [SUPPORTED_DOMAINS.DISCORD]: {
    PLAY_STORE_ID: "com.discord",
    APP_STORE_ID: "id985746746",
  },
  [SUPPORTED_DOMAINS.NETFLIX]: {
    PLAY_STORE_ID: "com.netflix.mediaclient",
    APP_STORE_ID: "id363590051",
  },
  [SUPPORTED_DOMAINS.WHATSAPP]: {
    PLAY_STORE_ID: "com.whatsapp",
    APP_STORE_ID: "id310633997",
  },
  [SUPPORTED_DOMAINS.SNAPCHAT]: {
    PLAY_STORE_ID: "com.snapchat.android",
    APP_STORE_ID: "id447188370",
  },
  [SUPPORTED_DOMAINS.PINTEREST]: {
    PLAY_STORE_ID: "com.pinterest",
    APP_STORE_ID: "id429047995",
  },
  [SUPPORTED_DOMAINS.REDDIT]: {
    PLAY_STORE_ID: "com.reddit.frontpage",
    APP_STORE_ID: "id1064216828",
  },
  [SUPPORTED_DOMAINS.ZOOM]: {
    PLAY_STORE_ID: "us.zoom.videomeetings",
    APP_STORE_ID: "id546505307",
  },
  [SUPPORTED_DOMAINS.UBER]: {
    PLAY_STORE_ID: "com.ubercab",
    APP_STORE_ID: "id368677368",
  },
  [SUPPORTED_DOMAINS.SWIGGY]: {
    PLAY_STORE_ID: "in.swiggy.android",
    APP_STORE_ID: "id989540920",
  },
  [SUPPORTED_DOMAINS.ZOMATO]: {
    PLAY_STORE_ID: "com.application.zomato",
    APP_STORE_ID: "id434613896",
  },
  [SUPPORTED_DOMAINS.EVOLVE]: {
    PLAY_STORE_ID: "in.evolve.android",
    APP_STORE_ID: "id1515433542",
  },
  [SUPPORTED_DOMAINS.JIRA]: {
    PLAY_STORE_ID: "com.atlassian.android.jira.core",
    APP_STORE_ID: "id1183700623",
  },
  [SUPPORTED_DOMAINS.NOTION]: {
    PLAY_STORE_ID: "com.notion.desktop",
    APP_STORE_ID: "id1477385704",
  },
  [SUPPORTED_DOMAINS.GMAIL]: {
    PLAY_STORE_ID: "com.google.android.gm",
    APP_STORE_ID: "id529379089",
  },
  [SUPPORTED_DOMAINS.HULU]: {
    PLAY_STORE_ID: "com.hulu.plus",
    APP_STORE_ID: "id1478350915",
  },
  [SUPPORTED_DOMAINS.GITLAB]: {
    PLAY_STORE_ID: "com.gitlab.android",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.BITBUCKET]: {
    PLAY_STORE_ID: "com.atlassian.bitbucket.mobile",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.GITHUB]: {
    PLAY_STORE_ID: "com.github.android",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.MEDIUM]: {
    PLAY_STORE_ID: "com.medium.reader",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.EVERNOTE]: {
    PLAY_STORE_ID: "com.evernote",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.PRIME_VIDEO]: {
    PLAY_STORE_ID: "com.amazon.avod.thirdpartyclient",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.QUORA]: {
    PLAY_STORE_ID: "com.quora.quora",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.CANVA]: {
    PLAY_STORE_ID: "com.canva.editor",
    APP_STORE_ID: "id1136756386",
  },
  [SUPPORTED_DOMAINS.FIGMA]: {
    PLAY_STORE_ID: "com.figma.editor",
    APP_STORE_ID: "id1136756386",
  },
};
