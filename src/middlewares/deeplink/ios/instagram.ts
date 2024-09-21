export const getInstagramUriScheme = (url: URL): string => {
  const urlString = url.toString();
  const pathParts = url.pathname.split("/");

  // Post
  if (urlString.includes("/p/")) {
    return "instagram://media?id=" + pathParts[2];
  }

  // Profile
  if (urlString.includes("/")) {
    return "instagram://user?username=" + pathParts[1];
  }

  // Direct message (if the URL contains a direct message reference, e.g. "/direct/")
  if (urlString.includes("/direct/")) {
    return "instagram://direct";
  }

  // Reels
  if (urlString.includes("/reel/")) {
    return "instagram://reel?id=" + pathParts[2];
  }

  // Stories (if the URL is referencing stories, e.g. "/stories/")
  if (urlString.includes("/stories/")) {
    return "instagram://story?username=" + pathParts[2];
  }

  return "";
};
