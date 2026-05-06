import { getCollection } from "astro:content";

export async function getPublicPageBySlug(slug: string) {
  const pages = await getCollection("publicPages", ({ data }) => !data.draft);
  return pages.find((page) => page.data.slug === slug);
}

export async function getHomepage() {
  const pages = await getCollection("homepage", ({ data }) => !data.draft);
  return pages[0];
}

export function normalizeRouteSlug(slug: string | undefined) {
  return (slug || "").replace(/^\/+|\/+$/g, "");
}
