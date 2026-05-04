import { getCollection } from "astro:content";

const defaults = {
  clases: {
    title: "Clases",
    description: "Material y contenido de las clases del Colegio.",
    professorEditable: false,
  },
  tareas: {
    title: "Tareas",
    description: "Asignaciones y entregas del curso.",
    professorEditable: false,
  },
  recursos: {
    title: "Recursos",
    description: "Material de apoyo, lecturas y enlaces para el curso.",
    professorEditable: false,
  },
};

export type PortalSection = keyof typeof defaults;

export async function getPortalPageConfig(section: PortalSection) {
  const pages = await getCollection("portalPages");
  const match = pages.find((entry) => entry.data.slug === section);
  if (!match) return defaults[section];
  return match.data;
}
