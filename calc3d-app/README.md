# Calc3D 🚀

Calc3D is a professional, open-source 3D printing cost calculator and management dashboard designed for makers and small businesses. It allows users to track their spools, manage their 3D printers fleet, compute highly customized budgets with multiple materials and printers, and export sleek PDF invoices.

## ✨ Key Features

- **Dynamic Budget Calculator**: Calculate the exact cost of your prints considering an unlimited number of filaments and printers simultaneously.
- **Accurate Cost Breakdown**: Computes material weight, electricity consumption (kWh), machine amortization, labor time, and custom profit margins.
- **Automated Logging**: Save your budgets and print history directly to the cloud automatically.
- **Export to PDF**: Generate clean, professional vector-PDF budgets to send directly to clients.
- **Fleet Management**: Catalog your 3D printers and track your filament spool inventory in real-time.
- **Live Tech Specs DB**: The platform is pre-loaded with an extensive database of 50+ contemporary 3D printers and filaments (Bambu Lab, Prusa, Creality, Elegoo, etc.).
- **Make.com Webhook Ready**: Integrated secure API endpoint to automatically expand your printer database via RSS bots or 3rd party automations.

## 🛠️ Tech Stack

Calc3D is built with modern, scalable web technologies:
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with customized, highly aesthetic modern UI components
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **PDF Generation**: `jspdf`

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine and a free [Supabase](https://supabase.com/) account for the database.

### 1. Database Setup
1. Create a new project in Supabase.
2. In the Supabase SQL Editor, run the `supabase-schema.sql` file to create the tables and security policies.
3. Run the `seed_printers_ext.sql` file to populate the database with the initial fleet of popular printers and filaments.

### 2. Environment Variables
Create a `.env.local` file in the root of the project and add your Supabase credentials keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
WEBHOOK_SECRET=your-secret-password-for-make-com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-webhooks
```

### 3. Local Development
Install dependencies and run the local development server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deploy on Vercel

The easiest way to deploy Calc3D is through the [Vercel Platform](https://vercel.com/new). Make sure to configure the **Root Directory** to `calc3d-app` and add all the Environment Variables in the project settings before clicking Deploy!

## 📄 License
Released under the [MIT License](LICENSE).
