import { fetchWithTimeout } from "@/lib/functions/fetch-with-timeout";
import { isValidUrl } from "@/lib/functions/urls";
import he from "he";
import { parse } from "node-html-parser";

export const getHtml = async (url: string) => {
  return await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "Linkwith.co Bot",
    },
  })
    .then((r) => r.text())
    .catch(() => null);
};

export const getHeadChildNodes = (html: string) => {
  const ast = parse(html); // parse the html into AST format with node-html-parser
  const metaTags = ast.querySelectorAll("meta").map(({ attributes }) => {
    const property = attributes.property ?? attributes.name ?? attributes.href;
    return {
      property,
      content: attributes.content,
    };
  });
  const title = ast.querySelector("title")?.innerText;
  const linkTags = ast.querySelectorAll("link").map(({ attributes }) => {
    const { rel, href } = attributes;
    return {
      rel,
      href,
    };
  });

  return { metaTags, title, linkTags };
};

export const getRelativeUrl = (url: string, imageUrl: string) => {
  if (!imageUrl) {
    return null;
  }
  if (isValidUrl(imageUrl)) {
    return imageUrl;
  }
  const { protocol, host } = new URL(url);
  const baseURL = `${protocol}//${host}`;
  return new URL(imageUrl, baseURL).toString();
};

export const getMetaTags = async (url: string) => {
  const html = await getHtml(url);
  if (!html) {
    return {
      ogTitle: url,
      ogDescription: "No description",
      ogImage: null,
    };
  }
  const { metaTags, title: titleTag, linkTags } = getHeadChildNodes(html);

  const object: Record<string, string | null> = {};

  metaTags.forEach(({ property, content }) => {
    if (property && !object[property]) {
      object[property] = content ? he.decode(content) : null;
    }
  });

  linkTags.forEach(({ rel, href }) => {
    if (rel && !object[rel]) {
      object[rel] = href ?? null;
    }
  });

  const title = object["og:title"] ?? object["twitter:title"] ?? titleTag;

  const description =
    object.description ??
    object["og:description"] ??
    object["twitter:description"];

  const image =
    object["og:image"] ??
    object["twitter:image"] ??
    object.image_src ??
    object.icon ??
    object["shortcut icon"];

  return {
    ogTitle: title ?? url,
    ogDescription: description ?? "No description",
    ogImage: image ? getRelativeUrl(url, image) : null,
  };
};
