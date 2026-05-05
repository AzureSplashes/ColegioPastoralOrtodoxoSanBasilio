import { getCollection } from "astro:content";

export async function getPublicPageBySlug(slug: string) {
  const pages = await getCollection("publicPages", ({ data }) => !data.draft);
  return pages.find((page) => page.data.slug === slug);
}

export function normalizeRouteSlug(slug: string | undefined) {
  return (slug || "").replace(/^\/+|\/+$/g, "");
}
