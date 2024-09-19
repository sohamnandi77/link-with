interface DeepLinkerOptions {
  onIgnored?: () => void;
  onFallback?: () => void;
  onReturn?: () => void;
}

export class DeepLinker {
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

  openURL(url: string, interval = 5000) {
    const dialogTimeout = interval;
    setTimeout(() => {
      if (this.hasFocus && this.options.onIgnored) {
        this.options.onIgnored();
      }
    }, dialogTimeout);
    window.location.href = url;
  }
}
