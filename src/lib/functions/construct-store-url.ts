export function constructStoreUrl(storeUrl: string): string {
  if (storeUrl.includes("play.google.com")) {
    // Extract the package name from the Play Store URL
    const packageNameMatch = /id=([^&]+)/.exec(storeUrl);
    if (!packageNameMatch) {
      throw new Error("Package name not found in Play Store URL");
    }
    const packageName = packageNameMatch[1];

    // Construct the Play Store intent URL with fallback to the original Play Store URL
    let playStoreUrl = `intent://details?id=${packageName}#Intent;scheme=https;package=com.android.vending;`;

    // Adding fallback to the Play Store website
    const fallbackUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    playStoreUrl += `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;

    return playStoreUrl;
  }

  // Check if it's an iOS App Store URL
  if (storeUrl.includes("apps.apple.com")) {
    const iosAppStorePrefix = "itms-apps://";
    const appStoreIdPattern = /id\d+/; // Look for "id" followed by numbers (App Store ID)

    // Extract the App Store ID from the URL
    const appStoreIdMatch = appStoreIdPattern.exec(storeUrl);
    if (!appStoreIdMatch) {
      throw new Error("App Store ID not found in URL");
    }

    const appStoreId = appStoreIdMatch[0]; // e.g., "id123456789"

    // Construct the App Store deep link
    return `${iosAppStorePrefix}${appStoreId}`;
  }

  throw new Error("Unknown URL format");
}
