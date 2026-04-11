# Política de Seguridad de MyCalc3D

La seguridad de MyCalc3D y de los datos de nuestros usuarios es una prioridad absoluta. Este documento describe nuestro enfoque para mantener un entorno seguro y profesional.

## Filosofía de Seguridad

MyCalc3D se basa en tres pilares fundamentales:
1.  **Minimalismo**: Reducimos la superficie de ataque eliminando elementos innecesarios y distracciones visuales.
2.  **Transparencia**: Al ser un proyecto de código abierto, cualquier persona puede auditar nuestro código.
3.  **Privacidad**: No recopilamos datos que no sean estrictamente necesarios para el funcionamiento de la herramienta.

## Medidas Implementadas

### 1. Control de Acceso (Dashboard de Administración)
El acceso al panel de administración central de MyCalc3D está restringido exclusivamente a las siguientes identidades verificadas:
-   `vigoanxo000@gmail.com`

Cualquier intento de acceso no autorizado es registrado automáticamente en nuestros sistemas de auditoría.

### 2. Protección Anti-Bots (Honeypot)
Todos los formularios públicos de MyCalc3D incluyen sistemas de detección de bots invisibles. Estas medidas protegen nuestra base de datos contra el spam y las inyecciones automatizadas sin interrumpir la experiencia de los usuarios humanos.

### 3. Seguridad de Datos (Supabase RLS)
Utilizamos políticas de seguridad a nivel de fila (Row Level Security) en Supabase para asegurar que:
-   Los usuarios solo puedan leer y escribir sus propios datos (bobinas, impresoras, presupuestos).
-   Los datos públicos sean de solo lectura para identidades no administrativas.

## Notificación de Vulnerabilidades

Si encuentras una vulnerabilidad en MyCalc3D, te agradecemos que nos lo comuniques de forma privada. Por favor, no publiques vulnerabilidades en issues públicos de GitHub.

### Proceso de Reporte
1.  Contacta directamente con el mantenedor del proyecto.
2.  Proporciona una descripción detallada del problema y los pasos para reproducirlo.
3.  Trabajaremos para solucionar el problema lo antes posible.

## Entorno Profesional

Para mantener un estándar de calidad corporativo:
-   No se permiten emojis ni lenguaje informal en la documentación técnica oficial.
-   La interfaz debe mantenerse limpia, profesional y basada en texto.

Gracias por ayudar a mantener MyCalc3D seguro y profesional.
