import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "static",   // Public pages: static HTML at build time
  adapter: netlify(), // Required for SSR pages (prerender = false)
});
