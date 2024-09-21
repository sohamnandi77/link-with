export const getFacebookUriScheme = (url: URL): string => {
  const urlString = url.toString();
  const pathParts = url.pathname.split("/");

  // Facebook Post
  if (urlString.includes("/posts/")) {
    return `fb://post/${pathParts[2]}`;
  }

  // Facebook Profile
  if (urlString.includes("/profile.php") || urlString.includes("/people/")) {
    const usernameOrId = url.searchParams.get("id") ?? pathParts[2];
    return `fb://profile/${usernameOrId}`;
  }

  // Facebook Page
  if (urlString.includes("/pages/")) {
    return `fb://page/${pathParts[2]}`;
  }

  // Facebook Group
  if (urlString.includes("/groups/")) {
    return `fb://group/${pathParts[2]}`;
  }

  // Facebook Video
  if (urlString.includes("/videos/")) {
    return `fb://video/${pathParts[2]}`;
  }

  // Default for unsupported URLs (open in web view modal)
  return `fb://facewebmodal/f?href=${encodeURIComponent(urlString)}`;
};
