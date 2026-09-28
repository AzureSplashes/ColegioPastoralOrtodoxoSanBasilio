# Portal académico: configuración de Supabase

1. En el proyecto Supabase usado por `PUBLIC_SUPABASE_URL`, abre **SQL Editor**.
2. Ejecuta [`migrations/20260928_portal_forums_grades.sql`](./migrations/20260928_portal_forums_grades.sql) y después [`migrations/20260928_portal_staff_tools.sql`](./migrations/20260928_portal_staff_tools.sql) en SQL Editor.
3. Comprueba que los usuarios tengan una fila en `public.profiles` con `role` igual a `alumno`, `profesor` o `admin`. La migración completa `display_name` a partir del nombre de cuenta o correo cuando está vacío.
4. Entra por `/alumnos/` o `/profesores/`. Ambos accesos llevan a `/alumnos/panel/`; las opciones de publicación de calificaciones solo aparecen para profesores y administradores.

El foro, los comunicados del portal y la boleta muestran un estado de configuración hasta que se ejecuten las migraciones. Las políticas RLS limitan el foro y los comunicados a miembros del portal y las calificaciones de cada alumno a su propia cuenta. Profesores y administradores pueden moderar el foro, publicar o eliminar comunicados del portal y crear, corregir o eliminar calificaciones. Las noticias públicas del sitio siguen bajo el CMS y aparecen como enlaces de solo lectura en Comunicados.
