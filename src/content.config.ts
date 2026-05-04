import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const avisos = defineCollection({
  loader: glob({ base: "./src/content/avisos", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

const clases = defineCollection({
  loader: glob({ base: "./src/content/clases", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
});

const tareas = defineCollection({
  loader: glob({ base: "./src/content/tareas", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    dueDate: z.coerce.date(),
    description: z.string(),
    link: z.string().optional(),
  }),
});

const recursos = defineCollection({
  loader: glob({ base: "./src/content/recursos", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["Lectura", "Video", "Documento", "Enlace"]),
    description: z.string(),
    link: z.string().optional(),
  }),
});

const portalPages = defineCollection({
  loader: glob({ base: "./src/content/portal_pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    slug: z.enum(["clases", "tareas", "recursos"]),
    title: z.string(),
    description: z.string(),
    professorEditable: z.boolean().default(false),
  }),
});

export const collections = { avisos, clases, tareas, recursos, portalPages };
