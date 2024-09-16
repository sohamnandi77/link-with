const supportedDeeplinkProtocols = [
  "mailto:",
  "tel:",
  "sms:",
  "whatsapp:",
  "tg:",
  "skype:",
  "viber:",
  "fb-messenger:",
  "slack:",
  "youtube:",
];

export const isSupportedDeeplinkProtocol = (url: string) => {
  return supportedDeeplinkProtocols.some((protocol) =>
    url.startsWith(protocol),
  );
};
