# Guia de Seguridad Calc3D

Esta guía contiene los pasos finales para asegurar tu aplicación contra ataques DDoS y mejorar la privacidad de tus usuarios.

## 1. Configuracion de Cloudflare (Recomendado)
Para protegerte contra ataques DDoS masivos, conecta tu dominio a Cloudflare:
1. Crea una cuenta gratuita en [Cloudflare](https://www.cloudflare.com/).
2. Añade tu dominio y cambia los servidores de nombres (Nameservers).
3. Asegúrate de que el "Proxy" (nube naranja) esté **activado** para tu dominio y el subdominio `www`.
4. En la pestaña **Security -> WAF**, puedes crear reglas para bloquear tráfico de países donde no esperas usuarios o bloquear IPs sospechosas.

## 2. Ajustes en Supabase
Configura estos límites para evitar abuso de correo y registros:
1. Ve a **Authentication -> Settings**.
2. En **Rate Limits**, ajusta:
   - **Confirmations per hour**: 5 (evita spam de emails).
   - **Recovery emails per hour**: 3.
3. Asegúrate de que **Site URL** sea exactamente la URL de tu aplicación en Vercel.

## 3. Seguridad Implementada en el Codigo
- **Security Headers**: Hemos configurado cabeceras `HSTS`, `CSP`, `X-Content-Type-Options` y `X-Frame-Options` para prevenir ataques de Clickjacking y XSS.
- **Bot Protection (HoneyPot)**: El formulario de sugerencias tiene una trampa oculta para bots que evita que recibas spam automatizado.
- **Row Level Security (RLS)**: Todas las tablas están protegidas. Los usuarios solo pueden ver y editar sus propios datos.
- **Admin Access**: El acceso al panel de administración está restringido exclusivamente a tu correo `vigoanxo000@gmail.com`.

## 4. Mejores Practicas
- **Nunca** compartas el archivo `.env.local` con nadie.
- **Nunca** expongas la `SUPABASE_SERVICE_ROLE_KEY` en el código del frontend.
- Cambia tu contraseña de Supabase periódicamente y usa **Autenticación en Dos Pasos (2FA)**.
