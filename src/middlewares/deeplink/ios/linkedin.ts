export const getLinkedinUriScheme = (url: URL): string => {
  const urlString = url.toString();
  return `linkedin://feed/post?url=${urlString}`;
};
