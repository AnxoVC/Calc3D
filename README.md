# Calc3D

Calc3D es una calculadora de costes de impresion 3D y un panel de gestion profesional de codigo abierto diseñado para makers y pequeñas empresas. Permite a los usuarios llevar un registro de sus bobinas, gestionar su flota de impresoras 3D, calcular presupuestos altamente personalizados con multiples materiales e impresoras, y exportar facturas en PDF limpias y precisas.

## Caracteristicas Principales

- Calculadora de Presupuestos Dinamica: Calcula el coste exacto de tus impresiones considerando un numero ilimitado de filamentos e impresoras simultaneamente.
- Desglose Preciso de Costes: Calcula el peso del material, el consumo de electricidad (kWh), la amortizacion de la maquina, el tiempo de mano de obra y los margenes de beneficio personalizados.
- Registro Automatico: Guarda tus presupuestos y el historial de impresiones directamente en la nube de forma automatica.
- Exportacion a PDF: Genera presupuestos limpios y profesionales en formato PDF vectorial para enviar directamente a los clientes.
- Gestion de Flota: Cataloga tus impresoras 3D y haz un seguimiento del inventario de tus bobinas de filamento en tiempo real.
- Tema Claro/Oscuro Integrado: Interfaz de usuario adaptativa que puedes cambiar con un solo clic según tus preferencias visuales.
- Base de Datos de Especificaciones Tecnicas: La plataforma viene pre-cargada con una elaborada base de datos de mas de 50 impresoras 3D y filamentos contemporaneos (Bambu Lab, Prusa, Creality, Elegoo, etc.).
- Integracion con Webhooks (Make.com): Ruta API segura integrada para expandir automaticamente tu base de datos de impresoras mediante bots RSS o automatizaciones de terceros.

## Tecnologias Utilizadas

Calc3D esta construido con tecnologias web modernas y escalables:
- Framework: Next.js 14 (App Router)
- Lenguaje: TypeScript
- Estilos: CSS Vanilla con componentes de interfaz de usuario modernos, personalizados y altamente esteticos
- Base de Datos y Autenticacion: Supabase (PostgreSQL + Row Level Security)
- Generacion de PDF: jspdf

## Primeros Pasos

### Requisitos Previos

Necesitas tener Node.js instalado en tu equipo y una cuenta gratuita de Supabase para la base de datos.

### 1. Configuracion de la Base de Datos
1. Crea un nuevo proyecto en Supabase.
2. En el Editor SQL de Supabase, ejecuta el archivo `supabase-schema.sql` para crear las tablas y las politicas de seguridad.
3. Ejecuta el archivo `seed_printers_ext.sql` para poblar la base de datos con la flota inicial de impresoras y filamentos populares.

### 2. Variables de Entorno
Crea un archivo `.env.local` dentro de la carpeta `calc3d-app` y añade tus claves de credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
WEBHOOK_SECRET=tu-contraseña-secreta-para-make-com
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-para-webhooks
```

### 3. Desarrollo Local
Abre una terminal, navega a la carpeta de la aplicacion, instala las dependencias y ejecuta el servidor de desarrollo local:
```bash
cd calc3d-app
npm install
npm run dev
```
Abre http://localhost:3000 con tu navegador para ver el resultado local.

## Despliegue en Vercel

La forma mas facil de publicar Calc3D en internet es a traves de la plataforma Vercel. 
Asegurate de configurar el Directorio Raiz (Root Directory) como `calc3d-app` dentro de los ajustes de Vercel y añade todas las Variables de Entorno en los ajustes del proyecto antes de pulsar en Desplegar.

## Licencia
Distribuido bajo la Licencia MIT. Consulta el archivo LICENSE para mas detalles.
