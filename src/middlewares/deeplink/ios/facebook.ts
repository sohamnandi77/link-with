export const getFacebookUriScheme = (url: URL): string => {
  const urlString = url.toString();
  return `fb://facewebmodal/f?href=${encodeURIComponent(urlString)}`;
};
