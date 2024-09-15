export function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = 5000,
) {
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Request timed out"));
    }, timeout);
    fetch(input, { ...init, signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
  });
}
