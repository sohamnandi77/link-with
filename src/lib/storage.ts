import { env } from "@/env";
import { AwsClient } from "aws4fetch";
import { fetchWithTimeout } from "./functions/fetch-with-timeout";

interface ImageOptions {
  contentType?: string;
  width?: number;
  height?: number;
}

type BlobLike = Blob | Buffer;

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

  async upload(key: string, body: BlobLike | string, opts?: ImageOptions) {
    let uploadBody: BlobLike;
    try {
      if (typeof body === "string") {
        if (this.isBase64(body)) {
          uploadBody = this.base64ToArrayBuffer(body, opts);
        } else if (this.isUrl(body)) {
          uploadBody = await this.urlToBlob(body, opts);
        } else {
          throw new Error("Invalid input: Not a base64 string or a valid URL");
        }
      } else {
        uploadBody = body;
      }

      const headers: Record<string, string> = {
        "Content-Length": uploadBody.size.toString(),
      };
      if (opts?.contentType) headers["Content-Type"] = opts.contentType;

      const response = await this.client.fetch(
        `${env.STORAGE_ENDPOINT}/${key}`,
        {
          method: "PUT",
          headers,
          body: uploadBody,
        },
      );

      return {
        url: `${env.STORAGE_BASE_URL}/${key}`,
      };
    } catch (error) {
      // Type guard for Error instances
      if (error instanceof Error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      // Handle unknown error types
      throw new Error("Failed to upload file: Unknown error");
    }
  }

  async fetch(key: string): Promise<Response> {
    const response = await this.client.fetch(`${env.STORAGE_ENDPOINT}/${key}`);
    return response;
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.fetch(
        `${env.STORAGE_ENDPOINT}/${key}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      throw new Error("Failed to delete file: Unknown error");
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    const url = new URL(`${env.STORAGE_ENDPOINT}/${key}`);
    url.searchParams.set("X-Amz-Expires", "600");

    const signed = await this.client.sign(url, {
      method: "PUT",
      aws: {
        signQuery: true,
        allHeaders: true,
      },
    });

    return signed.url.toString();
  }

  private base64ToArrayBuffer(base64: string, opts?: ImageOptions): Blob {
    // Remove data URL prefix and padding
    const base64Data = base64.replace(/^data:.+;base64,/, "");
    const paddedBase64Data = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      "=",
    );

    try {
      const binaryString = atob(paddedBase64Data);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      const blobProps: BlobPropertyBag = {};
      if (opts?.contentType) blobProps.type = opts.contentType;

      return new Blob([byteArray], blobProps);
    } catch (error) {
      throw new Error(
        "Failed to convert base64 to Blob: Invalid base64 string",
      );
    }
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

  private async urlToBlob(url: string, opts?: ImageOptions): Promise<Blob> {
    try {
      let response: Response;

      if (opts?.height || opts?.width) {
        const proxyUrl = new URL("https://wsrv.nl");
        proxyUrl.searchParams.set("url", url);
        if (opts.width) proxyUrl.searchParams.set("w", opts.width.toString());
        if (opts.height) proxyUrl.searchParams.set("h", opts.height.toString());
        proxyUrl.searchParams.set("fit", "cover");

        try {
          response = await fetchWithTimeout(proxyUrl.toString());
        } catch {
          response = await fetch(url);
        }
      } else {
        response = await fetch(url);
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch URL: ${response.status} ${response.statusText}`,
        );
      }

      const blob = await response.blob();
      if (opts?.contentType) {
        return new Blob([blob], { type: opts.contentType });
      }
      return blob;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to convert URL to Blob: ${error.message}`);
      }
      throw new Error("Failed to convert URL to Blob: Unknown error");
    }
  }
}

export const storage = new StorageClient();

export const isStored = (url: string): boolean => {
  return url.startsWith(env.STORAGE_BASE_URL ?? "");
};
