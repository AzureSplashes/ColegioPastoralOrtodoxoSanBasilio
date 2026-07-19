# Guía de Administración: Videos y Evaluaciones en el CRM

Esta guía contiene las instrucciones paso a paso para administrar las secciones de **Videos** y **Evaluaciones** del Portal de Alumnos por tu cuenta utilizando el panel del CRM (Decap CMS).

---

## 1. Acceso al CRM (Panel de Control)

1. Abre tu navegador e ingresa a la dirección de administración del sitio (por ejemplo, `tudominio.com/admin` o de forma local si estás desarrollando).
2. Inicia sesión con tus credenciales de administrador (administración delegada mediante Supabase / Git Gateway).

---

## 2. Cómo Agregar un Nuevo Video de Clase

Cuando tengas una nueva clase grabada en YouTube que desees subir al portal de alumnos:

1. En el menú lateral izquierdo del CRM, haz clic en la sección **Videos (Clases)**.
2. Haz clic en el botón **Nueva entrada** (ubicado arriba a la derecha).
3. Completa los siguientes campos:
   - **Título**: Escribe el nombre de la clase (ej: *Antiguo Testamento I. Génesis: Interpretación de la Sagrada Escritura*).
   - **Fecha**: Elige el día y hora en que se impartió o publicó la clase.
   - **Descripción**: Un resumen de una línea sobre lo que se verá en la clase.
   - **ID de Video de YouTube**: 
     - **Importante:** Aquí debes colocar únicamente el **código identificador de 11 caracteres** del video de YouTube.
     - **Cómo encontrarlo:** Si el enlace del video es `https://www.youtube.com/watch?v=QHOlYjEjzmY`, el ID es **`QHOlYjEjzmY`** (los caracteres que van después de `v=`).
     - Si el enlace es de una playlist como `https://www.youtube.com/watch?v=XYZ&list=123`, el ID es **`XYZ`** (lo que va después de `v=` y antes de `&list`).
   - **Contenido**: Aquí puedes escribir notas adicionales para los alumnos usando el editor (negrita, viñetas, enlaces).
4. Haz clic en el botón azul **Publicar** arriba.
5. El sistema integrará automáticamente un reproductor de video responsivo en la página del alumno para que puedan ver la clase directamente dentro del portal sin salir del sitio.

---

## 3. Cómo Agregar o Modificar Evaluaciones (Cuestionarios de Google Forms)

Puedes agregar cuestionarios individuales como nuevas tareas o bien editar la lista compilada.

### Opción A: Crear una nueva evaluación individual
1. En el menú lateral izquierdo, haz clic en **Evaluaciones (Tareas)**.
2. Haz clic en **Nueva entrada** (arriba a la derecha).
3. Completa los campos:
   - **Título**: El nombre del cuestionario (ej: *Evaluación de Éxodo I*).
   - **Fecha de entrega**: Elige la fecha límite para responderlo.
   - **Descripción**: Una breve instrucción (ej: *Por favor, responde el siguiente cuestionario basado en las lecturas*).
   - **Enlace (Google Forms, Drive, etc.)**: Pega aquí el enlace de compartir completo de tu formulario de Google (ej: `https://docs.google.com/forms/d/e/.../viewform`).
   - **Instrucciones**: Instrucciones en formato Markdown (ej: *Haz clic en el botón de abajo para abrir el cuestionario en una ventana nueva*).
4. Haz clic en **Publicar**.
5. En el portal del alumno, el enlace se mostrará con un botón que dice **"Abrir cuestionario (Google Forms)"** de manera automática al detectar que es un formulario.

### Opción B: Editar el compilado existente (ej: Enlaces a Cuestionarios Mayo 2026)
Si deseas agrupar varios enlaces en una sola página (como el archivo actual):
1. Ve a **Evaluaciones (Tareas)**.
2. Haz clic sobre la entrada existente (ej: *Enlaces a Cuestionarios (Mayo 2026)*) para abrir el editor.
3. Desplázate hasta el cuadro de **Instrucciones** (que es un editor de texto enriquecido).
4. Añade o edita los textos y enlaces usando el formato Markdown. Por ejemplo, para enlazar un nuevo cuestionario:
   ```markdown
   - [Nombre del Cuestionario](https://docs.google.com/forms/d/.../viewform)
   ```
5. Haz clic en el botón **Publicar** para guardar los cambios.

---

## 4. Notas Importantes para la Publicación

- **Tiempo de actualización:** Cuando haces clic en **Publicar** en el CRM, el servidor (Netlify) tarda aproximadamente **entre 1 y 2 minutos** en reconstruir el sitio web y aplicar los cambios. Si entras de inmediato y no ves tus actualizaciones, simplemente espera un minuto y refresca la página (F5 o Ctrl+F5).
- **Seguridad e Historial:** No tengas miedo de equivocarte al publicar. Todo cambio genera una copia de seguridad automática en el historial del sitio web. Si necesitas recuperar algo borrado o revertir un cambio, se puede solicitar al administrador del sistema.
