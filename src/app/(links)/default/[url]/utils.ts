const injectIframe = (src: string): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.position = "fixed";
  iframe.style.left = "-1px";
  document.body.appendChild(iframe);
  return iframe;
};

const ejectIframe = (iframe: HTMLIFrameElement): void => {
  document.body.removeChild(iframe);
};

export const browserDeeplink = (
  appLink: string,
  options: { waitTimeout?: number } = {},
): Promise<void> => {
  const defaults = { waitTimeout: 200 };
  const currentOptions = { ...defaults, ...options };

  return new Promise((resolve, reject) => {
    const iframe = injectIframe(appLink);
    const timeout = setTimeout(() => {
      window.removeEventListener("blur", windowBlurListener);
      ejectIframe(iframe);
      reject(new Error(`Can't open ${appLink}`));
    }, currentOptions.waitTimeout);

    function windowBlurListener() {
      window.removeEventListener("blur", windowBlurListener);
      clearTimeout(timeout);
      ejectIframe(iframe);
      resolve();
    }

    window.addEventListener("blur", windowBlurListener);
  });
};
