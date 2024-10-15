interface RQError extends Error {
  status: number;
}

export async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as RQError;
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}
