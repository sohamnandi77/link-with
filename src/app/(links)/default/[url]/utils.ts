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

interface DeepLinkerOptions {
  onIgnored?: () => void;
  onFallback?: () => void;
  onReturn?: () => void;
}

class DeepLinker {
  private options: DeepLinkerOptions;
  private hasFocus = true;
  private didHide = false;

  constructor(options: DeepLinkerOptions) {
    if (!options) {
      throw new Error("no options");
    }
    this.options = options;
    this.bindEvents("add");
  }

  private onBlur = () => {
    this.hasFocus = false;
  };

  private onVisibilityChange = (e: Event) => {
    if ((e.target as Document).visibilityState === "hidden") {
      this.didHide = true;
    }
  };

  private onFocus = () => {
    if (this.didHide) {
      if (this.options.onReturn) {
        this.options.onReturn();
      }
      this.didHide = false;
    } else {
      if (!this.hasFocus && this.options.onFallback) {
        setTimeout(() => {
          if (!this.didHide) {
            this.options.onFallback!();
          }
        }, 1000);
      }
    }
    this.hasFocus = true;
  };

  private bindEvents(mode: "add" | "remove") {
    const eventMethod =
      mode === "add" ? "addEventListener" : "removeEventListener";
    [
      [window, "blur", this.onBlur],
      [document, "visibilitychange", this.onVisibilityChange],
      [window, "focus", this.onFocus],
    ].forEach(([target, event, handler]) =>
      (target as (Window & typeof globalThis) | Document)[eventMethod](
        event as string,
        handler as EventListener,
      ),
    );
  }

  destroy() {
    this.bindEvents("remove");
  }

  openURL(url: string) {
    const dialogTimeout = 500;
    setTimeout(() => {
      if (this.hasFocus && this.options.onIgnored) {
        this.options.onIgnored();
      }
    }, dialogTimeout);
    window.location.href = url;
  }
}

export default DeepLinker;
