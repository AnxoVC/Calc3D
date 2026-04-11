# MyCalc3D 

**Prueba la aplicación online:** [https://mycalc3d.vercel.app](https://mycalc3d.vercel.app)

MyCalc3D es una calculadora de costes de impresion 3D y un panel de gestion profesional de codigo abierto diseñado para makers y pequeñas empresas. Permite a los usuarios llevar un registro de sus bobinas, gestionar su flota de impresoras 3D, calcular presupuestos altamente personalizados con multiples materiales e impresoras, y exportar facturas en PDF limpias y precisas.

## Caracteristicas Principales

- **Calculadora de Presupuestos Dinamica**: Calcula el coste exacto de tus impresiones considerando un numero ilimitado de filamentos e impresoras simultaneamente.
- **Panel de Administracion Pro**: Dashboard exclusivo con graficos SVG de area para visualizar el trafico por horas y dias de la semana en tiempo real.
- **Muro de la Comunidad**: Seccion de anuncios oficiales y sugerencias publicas para mejorar la interaccion con los usuarios.
- **Desglose Preciso de Costes**: Calcula el peso del material, el consumo de electricidad (kWh), la amortizacion de la maquina, el tiempo de mano de obra y los margenes de beneficio personalizados.
- **Registro Automatico**: Guarda tus presupuestos y el historial de impresiones directamente en la nube de forma automatica.
- **Exportacion a PDF**: Genera presupuestos limpios y profesionales en formato PDF vectorial.
- **Gestion de Flota**: Cataloga tus impresoras 3D y haz un seguimiento del inventario de tus bobinas de filamento.
- **Optimizacion Movil**: Interfaz responsiva con menu lateral tipo "drawer" para una navegacion fluida en cualquier dispositivo.
- **Base de Datos Pre-cargada**: Mas de 50 impresoras y filamentos contemporaneos (Bambu Lab, Prusa, Creality, etc.).

## Tecnologias Utilizadas

MyCalc3D esta construido con tecnologias web modernas y escalables:
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Vanilla con diseño ultra-minimalista y profesional
- **Base de Datos**: Supabase (PostgreSQL + RLS)
- **Graficos**: SVG dinamico con gradientes fluidos
- **Generacion de PDF**: jspdf

## Estructura del Proyecto

```text
.
├── LICENSE
├── README.md
├── SECURITY.md
└── calc3d-app/               # Aplicación principal Next.js
    ├── public/               # Activos estáticos
    ├── src/
    │   ├── app/              # Directorio de rutas (App Router)
    │   │   ├── api/          # Endpoints de API y Webhooks
    │   │   ├── app/          # Secciones internas de la app
    │   │   │   ├── admin/    # Panel de administración y estadísticas
    │   │   │   ├── calculadora/
    │   │   │   ├── presupuesto/
    │   │   │   └── ...       # Bobinas, Impresoras, Ajustes, etc.
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── globals.css   # Sistema de diseño global
    │   │   └── layout.tsx    # Layout raíz
    │   ├── components/       # Componentes reutilizables (Muro, Menú, etc.)
    │   ├── lib/              # Lógica de cálculo y clientes Supabase
    │   └── middleware.ts     # Control de acceso y seguridad
    ├── fix_admin_permissions.sql
    ├── supabase-schema.sql
    └── package.json
```

## Primeros Pasos

### Requisitos Previos
Necesitas tener Node.js instalado en tu equipo y una cuenta gratuita de Supabase para la base de datos.

### 1. Configuracion de la Base de Datos
1. Crea un nuevo proyecto en Supabase.
2. En el Editor SQL de Supabase, ejecuta el archivo `supabase-schema.sql` para crear las tablas.
3. Ejecuta el archivo `seed_printers_ext.sql` para la base de datos inicial.
4. Ejecuta `fix_admin_permissions.sql` para habilitar el rastreo de actividad y permisos de admin.

### 2. Variables de Entorno
Crea un archivo `.env.local` dentro de la carpeta `calc3d-app`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Desarrollo Local
```bash
cd calc3d-app
npm install
npm run dev
```

## Licencia
Distribuido bajo la Licencia MIT. Consulta el archivo LICENSE para mas detalles.
