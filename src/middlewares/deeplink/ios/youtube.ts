export const getYoutubeUriScheme = (url: URL): string => {
  const urlString = url.toString();
  const pathParts = url.pathname.split("/");

  // YouTube Video
  if (urlString.includes("/watch")) {
    const videoId = url.searchParams.get("v");
    return `vnd.youtube://watch?v=${videoId}`;
  }

  // YouTube Channel
  if (urlString.includes("/channel/")) {
    return `vnd.youtube://channel/${pathParts[2]}`;
  }

  // YouTube User
  if (urlString.includes("/user/")) {
    return `vnd.youtube://user/${pathParts[2]}`;
  }

  // YouTube Playlist
  if (urlString.includes("/playlist")) {
    const playlistId = url.searchParams.get("list");
    return `vnd.youtube://playlist?list=${playlistId}`;
  }

  // Default case: replace the protocol for unhandled URLs
  return urlString.replace(/^https?:\/\//, "vnd.youtube://");
};
