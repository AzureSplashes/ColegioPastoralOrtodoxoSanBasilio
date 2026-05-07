---
title: Guía de Edición
---

## Lo esencial en dos minutos

**Cómo se publica.** Cada vez que guarda con el botón **Publicar**, sus cambios se envían al historial del sitio. Netlify reconstruye la página en **uno o dos minutos**, y luego ya están en vivo. Si refresca el sitio inmediatamente y no ve el cambio, espere un minuto y vuelva a refrescar.

**Si algo falla, nada se pierde.** Cada cambio queda guardado en el historial. Si rompe algo o quiere volver atrás, escriba a Marco y se puede revertir sin perder el resto. **No hay manera de borrar nada para siempre desde este panel** — siempre se puede recuperar.

**Borrador (oculto al público).** Active la opción **Borrador** en una página para guardar sus cambios sin publicarlos. Útil mientras trabaja en algo largo. Cuando esté lista, desactívelo y publique.

---

## Crear una nueva página de cero

### Paso 1 — Crear la página

1. En el menú lateral, haga clic en **Páginas**
2. Haga clic en **Nueva página** (arriba a la derecha)
3. Complete los campos básicos:
   - **Título de la página** — el nombre completo, p. ej., *"Calendario académico"*
   - **Descripción para buscadores** — una línea para Google
   - **Ruta interna (URL)** — vea las reglas más abajo
   - **Sección activa del menú** — solo si la página aparecerá en el menú principal

### Paso 2 — Añadir el contenido

Use el botón **Add secciones de la página** (arriba) o el **botón circular morado** que aparece en el lado izquierdo de la pantalla mientras edita. Ambos abren el mismo menú con los 10 tipos de bloques disponibles.

### Paso 3 — Enlazarla desde el menú (si aplica)

Crear la página **no la enlaza automáticamente al menú**. Si quiere que aparezca en el menú principal del sitio:

1. Vaya a **Menú y pie de página → Menú principal**
2. Haga clic en **Add elementos del menú**
3. Complete:
   - **Etiqueta visible** — el texto que verá el visitante (p. ej., *"Calendario"*)
   - **Enlace** — la misma ruta que puso en la página, con `/` al inicio: `/calendario`
   - **Visible** — déjelo activado

---

## Reglas para la "Ruta interna (URL)"

La ruta es lo que aparece después del dominio en la dirección. Si pone `historia`, la página vive en `colegiopastoralortodoxosanbasilio.com.mx/historia`.

**Reglas que debe seguir:**

- ✅ Solo letras minúsculas y guiones: `calendario-academico`
- ✅ Sin espacios — use guiones en su lugar
- ✅ Sin acentos ni eñes — escriba `historia`, no `história`; `senores`, no `señores`
- ✅ Sin diagonales (`/`) al inicio o al final
- ❌ Ejemplo malo: `Calendario Académico`
- ✅ Ejemplo bueno: `calendario-academico`

Para la página de inicio del sitio, deje la ruta **vacía**.

---

## Los 10 bloques de página

Cada página se construye con bloques que puede combinar, reordenar y eliminar.

| Bloque | Para qué sirve |
|---|---|
| **Portada principal** | Imagen de fondo grande con título y botones — para el inicio de cada página |
| **Encabezado de sección** | Título grande y subtítulo, sin imagen, para separar partes |
| **Barra de beneficios** | Tres o cuatro íconos en fila con texto corto |
| **Tarjetas** | Cuadros visuales con imagen, título y enlace — buen recurso para resumir |
| **Texto** | Párrafos con formato Markdown |
| **Texto con imagen** | Una columna de texto y una de imagen, lado a lado |
| **Galería** | Conjunto de imágenes que se amplían al hacer clic |
| **Lista de documentos** | Enlaces a PDFs u otros archivos descargables |
| **Autoridades y profesores** | Director destacado y rejilla de profesorado |
| **Contacto** | Datos de contacto con formulario opcional |

**Reordenar bloques:** arrastre el ícono de mover (al lado del bloque) hacia arriba o abajo.

**Eliminar un bloque:** haga clic en la **×** en la esquina del bloque.

---

## Imágenes

### Tamaños recomendados

| Bloque | Formato ideal | Tamaño aproximado |
|---|---|---|
| Portada principal — fondo | Horizontal panorámica | 2000 × 1000 píxeles |
| Portada principal — lateral | Vertical o cuadrada | 800 × 800 píxeles |
| Tarjetas | Cuadrada o ligeramente horizontal | 800 × 600 píxeles |
| Texto con imagen | Vertical u horizontal según diseño | 1000 × 1200 píxeles |
| Galería | Horizontal preferido, todas del mismo tamaño | 1200 × 800 píxeles |
| Autoridades y profesores | Vertical, rostro arriba | 600 × 800 píxeles |

Las fotos no se rompen si son de otro tamaño — el sitio las ajusta. Pero si todas las fotos de un bloque tienen formatos muy distintos, el resultado se ve descuidado. Cuando pueda, use fotos del mismo formato dentro del mismo bloque.

### "Encuadre" y "Posición / Anclaje"

Cuando una foto no llena el espacio que se le asigna, hay dos controles que ayudan:

- **Encuadre** decide cómo se ajusta la foto al cuadro:
  - **Cover** *(predeterminado)* — la foto llena todo el cuadro y se recorta lo que sobra. Bueno para fotos donde lo importante está en el centro
  - **Contain** — la foto completa se muestra, con espacios de fondo si no calza. Útil cuando no quiere recortar nada (logos, escudos)

- **Posición / Anclaje** decide *qué parte* de la foto queda visible cuando se recorta:
  - **Center** *(predeterminado)* — el centro de la imagen
  - **Top** — la parte de arriba (útil cuando es una foto de cuerpo completo y quiere que se vea la cara)
  - **Bottom**, **Left**, **Right**, y combinaciones — para casos especiales

**Receta: foto donde la cara queda cortada.** Cambie *Encuadre* a `cover` y *Posición* a `top`.

**Receta: una imagen institucional que no se debe recortar.** Cambie *Encuadre* a `contain`.

### "Texto alternativo" — siempre llénelo

El campo *Texto alternativo* o *Descripción accesible* sirve para:
- Personas que usan lectores de pantalla (accesibilidad)
- Buscadores como Google que indexan imágenes
- Casos donde la imagen no carga (se muestra el texto)

Una línea breve es suficiente: *"Padre Saúl en la entrada del colegio"*. No deje el campo vacío.

### Hero — Tono superpuesto

La **Portada principal** tiene un campo *Tono superpuesto* que aplica una capa de color translúcida sobre la imagen de fondo. Hace el texto más legible y le da identidad de marca al bloque.

Opciones:
- **purple-soft** *(predeterminado)* — morado suave de la marca, recomendado para la mayoría de fotos
- **purple-strong** — morado intenso, para fotos con muchos detalles que distraen
- **gold-soft** — dorado suave, para una sensación más cálida
- **dark-soft** / **dark-strong** — oscurecimiento neutral, para fotos que ya tienen color
- **none** — sin capa, foto cruda

### Autoridades y profesores — Forma de las fotos

El bloque tiene un campo *Forma de las fotos* que aplica a todas las fotos del bloque a la vez:

- **rectangle** *(predeterminado)* — fotos rectangulares, todas con el mismo aspecto
- **circle** — fotos circulares con borde dorado en el director y círculos limpios en los profesores

Recomendación: si las fotos del personal no son todas del mismo tamaño, **rectangle** es más perdonador.

### Ampliar imágenes en el sitio publicado

En el sitio en vivo, **todas las imágenes son clicables**. Hacer clic en cualquiera la abre en grande sobre la página. No necesita configurar nada.

---

## Lista de íconos disponibles

Varios bloques aceptan un *Ícono* — escriba el nombre exacto en minúsculas con guiones. Si no encuentra el que busca aquí, vea la biblioteca completa en **lucide.dev**.

### Comunicación y avisos
`mail` · `phone` · `message-square` · `send` · `bell` · `megaphone` · `globe`

### Personas
`user` · `users` · `user-circle` · `graduation-cap`

### Educación y contenido
`book` · `book-open` · `library` · `school` · `pencil` · `pen-tool` · `file-text` · `scroll`

### Religión y emblemas
`cross` · `church` · `heart` · `sun` · `moon` · `star` · `sparkles` · `award`

### Tiempo y calendario
`calendar` · `calendar-days` · `clock` · `clock-1`

### Archivos y enlaces
`file` · `folder` · `download` · `upload` · `link` · `external-link` · `paperclip`

### Información y estado
`info` · `help-circle` · `alert-circle` · `check-circle` · `check` · `x` · `alert-triangle`

### Ubicación y edificios
`map-pin` · `map` · `building` · `home`

### Acciones e iconos generales
`circle` · `square` · `arrow-right` · `arrow-up` · `chevron-right` · `chevron-down` · `plus` · `minus` · `search` · `eye` · `lock` · `unlock`

---

## Vista previa mientras edita

Al abrir una página para editar, **el panel se divide en dos**: a la izquierda los campos, a la derecha la vista previa con el diseño real del sitio.

**Atajos visuales que ayudan:**

- **Brillo morado al pasar el cursor.** Pase el cursor por un campo en el formulario y el bloque correspondiente en la vista previa se iluminará. Sirve para identificar qué está editando cuando hay muchos bloques.
- **Botón circular morado a la izquierda.** Lo lleva al control de "Add secciones de la página" desde cualquier parte de la página, sin tener que subir manualmente.
- **Sincronización de desplazamiento.** Cuando hace scroll en uno de los paneles, el otro lo sigue automáticamente.

**En el listado de páginas (vista de "Páginas"):** pase el cursor sobre cualquier entrada y aparecerá una **miniatura de la página real** a un costado. Útil para identificar visualmente qué página quiere editar.

---

## Formato de texto (Markdown)

En los campos con editor de texto enriquecido, puede usar Markdown:

| Lo que escribe | Lo que se ve |
|---|---|
| `**texto en negrita**` | **texto en negrita** |
| `*texto en cursiva*` | *texto en cursiva* |
| `[Texto del enlace](https://ejemplo.com)` | Un enlace que se puede hacer clic |
| `# Título grande` | Encabezado principal |
| `## Título mediano` | Encabezado secundario |
| `- Elemento de lista` | Una lista con puntos |
| `1. Elemento numerado` | Una lista numerada |

---

## Portal de Alumnos

Para publicar contenido en el portal (Clases, Tareas, Recursos):

1. Seleccione la colección correspondiente en el menú lateral
2. Haga clic en **Nueva entrada**
3. Complete los campos y use el editor Markdown para el contenido
4. Haga clic en **Publicar**

**Ejemplo de enlace en una tarea:**

```
Revise el material en [Google Drive](https://drive.google.com/...)
```

---

## Avisos / Anuncios

Los avisos aparecen en la página pública de Avisos. Cada aviso tiene:

- **Título** y **fecha**
- **Descripción breve** — se muestra en la tarjeta de la lista
- **Imagen** opcional — se muestra en la tarjeta
- **Contenido** completo con formato Markdown

---

## Cuando algo no funciona

1. **Refresque la página del panel** (F5 o Ctrl+R). A veces es lo único que hace falta.
2. **Espere uno o dos minutos.** El sitio en vivo tarda en reconstruirse después de cada *Publicar*.
3. **Si todavía hay un problema**, escriba a Marco con:
   - Qué estaba intentando hacer
   - Qué pasó (o no pasó)
   - Una captura de pantalla, si puede

Recuerde: nada de lo que haga aquí se pierde para siempre. Todo es revertible.
