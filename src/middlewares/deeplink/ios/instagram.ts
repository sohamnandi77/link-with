export const getInstagramUriScheme = (url: URL): string => {
  const urlString = url.toString();
  return `instagram://media?id=${urlString}`;
};
