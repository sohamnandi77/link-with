import { env } from "@/env";
import { AwsClient } from "aws4fetch";
import { fetchWithTimeout } from "./functions/fetch-with-timeout";

interface imageOptions {
  contentType?: string;
  width?: number;
  height?: number;
}

interface AwsClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  service?: string;
  region?: string;
  cache?: Map<string, ArrayBuffer>;
  retries?: number;
  initRetryMs?: number;
}

class StorageClient {
  private client: AwsClient;

  constructor() {
    if (
      !env.STORAGE_ENDPOINT ||
      !env.STORAGE_ACCESS_KEY_ID ||
      !env.STORAGE_SECRET_ACCESS_KEY
    ) {
      throw new Error(
        "STORAGE_ENDPOINT, STORAGE_ACCESS_KEY_ID, and STORAGE_SECRET_ACCESS_KEY must be set in the .env file",
      );
    }

    const config: AwsClientConfig = {
      accessKeyId: env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
      service: "s3",
      region: "auto",
    };

    // Type assertion to ensure AwsClient accepts our config
    this.client = new AwsClient(config);
  }

  async upload(key: string, body: Blob | Buffer | string, opts?: imageOptions) {
    let uploadBody: Blob;
    if (typeof body === "string") {
      if (this.isBase64(body)) {
        uploadBody = this.base64ToArrayBuffer(body, opts);
      } else if (this.isUrl(body)) {
        uploadBody = await this.urlToBlob(body, opts);
      } else {
        throw new Error("Invalid input: Not a base64 string or a valid URL");
      }
    } else if (body instanceof Buffer) {
      uploadBody = new Blob([body]);
    } else {
      uploadBody = body;
    }

    const headers: Record<string, string> = {
      "Content-Length": uploadBody.size.toString(),
    };
    if (opts?.contentType) headers["Content-Type"] = opts.contentType;

    try {
      await this.client.fetch(`${env.STORAGE_ENDPOINT}/${key}`, {
        method: "PUT",
        headers,
        body: uploadBody,
      });

      return {
        url: `${env.STORAGE_BASE_URL}/${key}`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      throw new Error("Failed to upload file: Unknown error");
    }
  }
  async fetch(key: string) {
    return this.client.fetch(`${env.STORAGE_ENDPOINT}/${key}`);
  }

  async delete(key: string) {
    await this.client.fetch(`${env.STORAGE_ENDPOINT}/${key}`, {
      method: "DELETE",
    });

    return { success: true };
  }

  async getSignedUrl(key: string) {
    const url = new URL(`${env.STORAGE_ENDPOINT}/${key}`);

    // 10 minutes expiration
    url.searchParams.set("X-Amz-Expires", "600");

    const signed = await this.client.sign(url, {
      method: "PUT",
      aws: {
        signQuery: true,
        allHeaders: true,
      },
    });

    return signed.url;
  }

  private base64ToArrayBuffer(base64: string, opts?: imageOptions) {
    const base64Data = base64.replace(/^data:.+;base64,/, "");
    const paddedBase64Data = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      "=",
    );

    const binaryString = atob(paddedBase64Data);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    const blobProps: { type?: string } = {};
    if (opts?.contentType) blobProps.type = opts.contentType;
    return new Blob([byteArray], blobProps);
  }
  private isBase64(str: string): boolean {
    const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([^\s]*)$/;
    return regex.test(str);
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  private async urlToBlob(url: string, opts?: imageOptions): Promise<Blob> {
    let response: Response;
    if (opts?.height || opts?.width) {
      try {
        const proxyUrl = new URL("https://wsrv.nl");
        proxyUrl.searchParams.set("url", url);
        if (opts.width) proxyUrl.searchParams.set("w", opts.width.toString());
        if (opts.height) proxyUrl.searchParams.set("h", opts.height.toString());
        proxyUrl.searchParams.set("fit", "cover");
        response = await fetchWithTimeout(proxyUrl.toString());
      } catch {
        response = await fetch(url);
      }
    } else {
      response = await fetch(url);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (opts?.contentType) {
      return new Blob([blob], { type: opts.contentType });
    }
    return blob;
  }
}

export const storage = new StorageClient();

export const isStored = (url: string) => {
  return url.startsWith(env.STORAGE_BASE_URL);
};
