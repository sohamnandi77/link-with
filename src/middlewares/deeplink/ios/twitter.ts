export const getTwitterUriScheme = (url: URL): string => {
  const urlString = url.toString();
  return `twitter://post?message=${urlString}`;
};
