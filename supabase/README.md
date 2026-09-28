# Portal académico: configuración de Supabase

1. En el proyecto Supabase usado por `PUBLIC_SUPABASE_URL`, abre **SQL Editor**.
2. Ejecuta [`migrations/20260928_portal_forums_grades.sql`](./migrations/20260928_portal_forums_grades.sql) una vez.
3. Comprueba que los usuarios tengan una fila en `public.profiles` con `role` igual a `alumno`, `profesor` o `admin`. La migración completa `display_name` a partir del nombre de cuenta o correo cuando está vacío.
4. Entra por `/alumnos/` o `/profesores/`. Ambos accesos llevan a `/alumnos/panel/`; las opciones de publicación de calificaciones solo aparecen para profesores y administradores.

El foro y la boleta muestran un estado de configuración hasta que se ejecute la migración. Las políticas RLS limitan el foro a miembros del portal y las calificaciones de cada alumno a su propia cuenta; profesores y administradores pueden publicar y consultar calificaciones.
