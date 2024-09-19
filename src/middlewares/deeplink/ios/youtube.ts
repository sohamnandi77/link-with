export const getYoutubeUriScheme = (url: URL): string => {
  const urlString = url.toString();
  return `youtube://${urlString}`;
};
