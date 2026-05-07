import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const avisos = defineCollection({
  loader: glob({ base: "./src/content/avisos", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
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

const buttonSchema = z.object({
  label: z.string(),
  href: z.string(),
  style: z.enum(["primary", "outline", "link"]).default("primary"),
  icon: z.string().optional(),
});

// Optional per-image presentation controls (object-fit + object-position).
// Editors set these in the CMS to compensate for inconsistently-framed source photos.
const imageFitEnum = z.enum(["cover", "contain"]).optional();
const imagePositionEnum = z.enum([
  "center", "top", "bottom", "left", "right",
  "top left", "top right", "bottom left", "bottom right",
]).optional();

const pageBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    title: z.string(),
    subtitle: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundPosition: imagePositionEnum,
    backgroundOverlay: z.enum([
      "none", "purple-soft", "purple-strong", "gold-soft", "dark-soft", "dark-strong",
    ]).optional(),
    sideImage: z.string().optional(),
    buttons: z.array(buttonSchema).default([]),
  }),
  z.object({
    type: z.literal("section_header"),
    title: z.string(),
    text: z.string().optional(),
  }),
  z.object({
    type: z.literal("feature_bar"),
    items: z.array(z.object({
      icon: z.string().default("circle"),
      title: z.string(),
      text: z.string(),
    })).default([]),
  }),
  z.object({
    type: z.literal("cards"),
    backgroundImage: z.string().optional(),
    backgroundTint: z.boolean().default(false),
    items: z.array(z.object({
      image: z.string().optional(),
      imageFit: imageFitEnum,
      imagePosition: imagePositionEnum,
      icon: z.string().optional(),
      title: z.string(),
      text: z.string().optional(),
      href: z.string().optional(),
      linkLabel: z.string().optional(),
      variant: z.enum(["standard", "institutional"]).default("standard"),
    })).default([]),
  }),
  z.object({
    type: z.literal("text"),
    heading: z.string().optional(),
    body: z.string(),
    align: z.enum(["left", "center"]).default("left"),
    maxWidth: z.enum(["narrow", "normal", "wide"]).default("normal"),
  }),
  z.object({
    type: z.literal("text_image"),
    heading: z.string().optional(),
    body: z.string(),
    image: z.string(),
    imageAlt: z.string().optional(),
    imagePosition: z.enum(["left", "right"]).default("right"),
    imageFit: imageFitEnum,
    imageAnchor: imagePositionEnum,
    buttons: z.array(buttonSchema).default([]),
  }),
  z.object({
    type: z.literal("gallery"),
    title: z.string().optional(),
    images: z.array(z.object({
      image: z.string(),
      alt: z.string().optional(),
      imageFit: imageFitEnum,
      imagePosition: imagePositionEnum,
    })).default([]),
  }),
  z.object({
    type: z.literal("resource_list"),
    items: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      href: z.string(),
    })).default([]),
  }),
  z.object({
    type: z.literal("staff_list"),
    photoShape: z.enum(["rectangle", "circle"]).optional(),
    director: z.object({
      role: z.string(),
      name: z.string(),
      image: z.string().optional(),
      imageFit: imageFitEnum,
      imagePosition: imagePositionEnum,
      description: z.string().optional(),
    }).optional(),
    people: z.array(z.object({
      role: z.string(),
      name: z.string(),
      image: z.string().optional(),
      imageFit: imageFitEnum,
      imagePosition: imagePositionEnum,
      subjects: z.array(z.string()).default([]),
    })).default([]),
  }),
  z.object({
    type: z.literal("contact"),
    intro: z.string().optional(),
    items: z.array(z.object({
      icon: z.string().default("info"),
      title: z.string(),
      lines: z.array(z.string()).default([]),
    })).default([]),
    showForm: z.boolean().default(true),
  }),
]);

const publicPagesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  activePage: z.string().optional(),
  draft: z.boolean().default(false),
  // Reminder field only — Decap doesn't auto-add to the menu, so this is
  // just a flag the editor sets to remind themselves to update Menú principal.
  showInMenu: z.boolean().optional(),
  sections: z.array(pageBlockSchema).default([]),
});

const publicPages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: publicPagesSchema,
});

const homepage = defineCollection({
  loader: glob({ base: "./src/content/homepage", pattern: "**/*.{md,mdx}" }),
  schema: publicPagesSchema,
});

const navigation = defineCollection({
  loader: glob({ base: "./src/content/settings/navigation", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      activePage: z.string().optional(),
      visible: z.boolean().default(true),
      locked: z.boolean().default(false),
      children: z.array(z.object({
        label: z.string(),
        href: z.string(),
        visible: z.boolean().default(true),
      })).default([]),
    })).default([]),
  }),
});

const footer = defineCollection({
  loader: glob({ base: "./src/content/settings/footer", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    description: z.string(),
    columns: z.array(z.object({
      title: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string().optional(),
      })).default([]),
    })).default([]),
    contact: z.array(z.string()).default([]),
    copyright: z.string().optional(),
  }),
});

export const collections = {
  avisos,
  clases,
  tareas,
  recursos,
  portalPages,
  publicPages,
  homepage,
  navigation,
  footer,
};
