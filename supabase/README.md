# Portal académico: configuración de Supabase

1. En el proyecto Supabase usado por `PUBLIC_SUPABASE_URL`, abre **SQL Editor**.
2. Ejecuta [`migrations/20260928_portal_forums_grades.sql`](./migrations/20260928_portal_forums_grades.sql), después [`migrations/20260928_portal_staff_tools.sql`](./migrations/20260928_portal_staff_tools.sql) y [`migrations/20260928_portal_display_names.sql`](./migrations/20260928_portal_display_names.sql) en SQL Editor.
3. Comprueba que los usuarios tengan una fila en `public.profiles` con `role` igual a `alumno`, `profesor` o `admin`. La migración completa `display_name` a partir del nombre de cuenta o correo cuando está vacío.
4. Entra por `/alumnos/` o `/profesores/`. Ambos accesos llevan a `/alumnos/panel/`; las opciones de publicación de calificaciones solo aparecen para profesores y administradores.

El foro, los comunicados del portal y la boleta muestran un estado de configuración hasta que se ejecuten las migraciones. Las políticas RLS limitan el foro y los comunicados a miembros del portal y las calificaciones de cada alumno a su propia cuenta. Profesores y administradores pueden moderar el foro, publicar o eliminar comunicados del portal y crear, corregir o eliminar calificaciones. Las noticias públicas del sitio siguen bajo el CMS y aparecen como enlaces de solo lectura en Comunicados.

## Correo de recuperación con marca del Colegio

1. En Supabase, ve a **Authentication → Email Templates → Reset Password**. Usa el asunto **Restablece tu contraseña | Colegio San Basilio** y pega el contenido de [`templates/recovery.html`](./templates/recovery.html). El botón usa `{{ .TokenHash }}` para llevar directamente a la página del Colegio, donde se verifica el token de recuperación.
2. En **Authentication → URL Configuration**, confirma que el Site URL sea `https://colegiopastoralortodoxosanbasilio.com.mx` y añade `https://colegiopastoralortodoxosanbasilio.com.mx/reset-password/` a los Redirect URLs.
3. Para que el remitente también sea del Colegio, configura **Authentication → SMTP Settings** con un proveedor SMTP y una dirección del dominio, por ejemplo `acceso@colegiopastoralortodoxosanbasilio.com.mx`. Configura SPF, DKIM y DMARC según el proveedor. La plantilla cambia el contenido y el enlace, pero el remitente requiere SMTP propio.
4. Envía una recuperación de prueba a una cuenta real y abre el correo más reciente. Desactiva el seguimiento de enlaces del proveedor de correo si está habilitado.

Los miembros del portal pueden guardar su nombre visible en **Mi perfil**. La función SQL solo modifica `display_name` de la cuenta autenticada; no permite cambiar `role`. La migración retira el permiso de actualización directa de `profiles` para impedir cambios de rol desde el cliente.
