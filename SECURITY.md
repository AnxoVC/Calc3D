# Guia de Seguridad MyCalc3D

Esta guía contiene los pasos finales para asegurar tu aplicación contra ataques DDoS y mejorar la privacidad de tus usuarios.

## 1. Configuracion de Cloudflare (Recomendado para Anti-DDoS)
Para protegerte contra ataques de denegación de servicio (DDoS) masivos, conecta tu dominio a Cloudflare:
1. Crea una cuenta gratuita en [Cloudflare](https://www.cloudflare.com/).
2. Añade tu dominio y cambia los servidores de nombres (Nameservers).
3. Asegúrate de que el "Proxy" (nube naranja) esté **activado**.
4. En la pestaña **Security -> WAF**, Cloudflare bloqueará automáticamente la mayoría de los ataques de denegación de servicio antes de que lleguen a Vercel.

## 2. Ajustes de Supabase (Límites de Tasa)
Configura estos límites en el dashboard de Supabase para evitar el spam y la saturación:
1. Ve a **Authentication -> Settings**.
2. En **Rate Limits**, ajusta:
   - **Confirmations per hour**: 5 (evita spam de emails).
   - **Recovery emails per hour**: 3.
3. Esto previene que alguien "inunde" tu servidor con peticiones de registro falsas.

## 3. Protección a Nivel de Aplicación
MyCalc3D incluye medidas de seguridad integradas en el código:
-   **Content-Security-Policy (CSP)**: El servidor tiene una política estricta que impide la ejecución de scripts maliciosos de terceros (protección proactiva contra XSS).
-   **Database Rate Limiting**: La tabla de sugerencias tiene un cerrojo (Trigger de Postgres) que limita a cada usuario a un máximo de 3 mensajes por hora, evitando ataques de spam manual o automatizado.
-   **Sanitización Automática**: React gestiona el escape de datos en todas las vistas de administración y comunidad.

## 4. Seguridad contra Suplantación (Spoofing)
- **Token Firmado**: MyCalc3D utiliza tokens JWT firmados dinámicamente. Es imposible que un atacante suplante tu identidad de administrador modificando el código del navegador, ya que el servidor de Supabase verifica la firma criptográfica en cada petición.
- **RLS Crítico**: Las políticas de seguridad a nivel de fila aseguran que, aunque alguien conociera el enlace privado de otro usuario, el sistema le devolvería un error "404" o "Acceso Denegado" al intentar leer los datos.

## 4. Mejores Practicas
- **Nunca** compartas el archivo `.env.local` con nadie.
- **Nunca** expongas la `SUPABASE_SERVICE_ROLE_KEY` en el código del frontend.
- Cambia tu contraseña de Supabase periódicamente y usa **Autenticación en Dos Pasos (2FA)**.

Gracias por ayudar a mantener MyCalc3D seguro y profesional.
