/**
 * Content collection schemas for Astro v6.
 * Collections: avisos (public), clases/tareas/recursos (protected).
 * Decap CMS writes .md files to each folder.
 */
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

export const collections = { avisos, clases, tareas, recursos };
