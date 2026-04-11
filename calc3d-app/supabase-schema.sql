-- =============================================
-- MyCalc3D - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PUBLIC TABLES (no auth required)
-- =============================================

-- Printers database (public)
CREATE TABLE IF NOT EXISTS printers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  wattage_w INTEGER NOT NULL,
  build_volume TEXT,
  type TEXT DEFAULT 'FDM',
  image_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Filaments database (public)
CREATE TABLE IF NOT EXISTS filaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  material TEXT NOT NULL,
  color_name TEXT,
  color_hex TEXT DEFAULT '#ffffff',
  diameter_mm NUMERIC DEFAULT 1.75,
  price_per_kg NUMERIC,
  density_g_cm3 NUMERIC,
  image_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER TABLES (auth required)
-- =============================================

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_kwh_price NUMERIC DEFAULT 0.15,
  default_spool_weight_g INTEGER DEFAULT 1000,
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User printers (from public DB or custom)
CREATE TABLE IF NOT EXISTS user_printers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  printer_id UUID REFERENCES printers(id),
  nickname TEXT,
  custom_wattage_w INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User spools / filament inventory
CREATE TABLE IF NOT EXISTS spools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filament_id UUID REFERENCES filaments(id),
  brand TEXT,
  material TEXT,
  color_name TEXT,
  color_hex TEXT DEFAULT '#ffffff',
  total_weight_g INTEGER DEFAULT 1000,
  remaining_weight_g INTEGER DEFAULT 1000,
  purchase_price NUMERIC,
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculations / cost history
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  printer_id UUID REFERENCES printers(id),
  filament_id UUID REFERENCES filaments(id),
  weight_g NUMERIC NOT NULL,
  time_hours NUMERIC NOT NULL,
  kwh_price NUMERIC,
  material_cost NUMERIC,
  electricity_cost NUMERIC,
  amortization_cost NUMERIC,
  labor_cost NUMERIC,
  margin_pct NUMERIC DEFAULT 0,
  total_cost NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Print diary / history
CREATE TABLE IF NOT EXISTS print_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  weight_g NUMERIC,
  time_hours NUMERIC,
  cost_total NUMERIC,
  printer_id UUID REFERENCES printers(id),
  filament_id UUID REFERENCES filaments(id),
  status TEXT DEFAULT 'completed',
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consumables
CREATE TABLE IF NOT EXISTS consumables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  price NUMERIC,
  stock_qty NUMERIC,
  unit TEXT DEFAULT 'ud',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE spools ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;

-- Public tables: anyone can read
CREATE POLICY "printers_public_read" ON printers FOR SELECT USING (true);
CREATE POLICY "filaments_public_read" ON filaments FOR SELECT USING (true);

-- User tables: only owner
CREATE POLICY "user_settings_own" ON user_settings USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_printers_own" ON user_printers USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spools_own" ON spools USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calculations_own" ON calculations USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "print_history_own" ON print_history USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consumables_own" ON consumables USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SEED DATA - Printers
-- =============================================
INSERT INTO printers (brand, model, wattage_w, build_volume, type, verified) VALUES
-- Bambu Lab
('Bambu Lab', 'X1 Carbon', 1000, '256×256×256mm', 'FDM', true),
('Bambu Lab', 'X1E', 1000, '256×256×256mm', 'FDM', true),
('Bambu Lab', 'P1S', 350, '256×256×256mm', 'FDM', true),
('Bambu Lab', 'P1P', 300, '256×256×256mm', 'FDM', true),
('Bambu Lab', 'A1 Mini', 200, '180×180×180mm', 'FDM', true),
('Bambu Lab', 'A1', 300, '256×256×256mm', 'FDM', true),
-- Prusa
('Prusa', 'MK4', 220, '250×210×220mm', 'FDM', true),
('Prusa', 'MK3S+', 200, '250×210×210mm', 'FDM', true),
('Prusa', 'XL', 600, '360×360×360mm', 'FDM', true),
('Prusa', 'MINI+', 120, '180×180×180mm', 'FDM', true),
('Prusa', 'SL1S Speed', 150, '127×80×150mm', 'SLA', true),
-- Creality
('Creality', 'Ender 3 V3', 350, '220×220×250mm', 'FDM', true),
('Creality', 'Ender 3 V3 SE', 270, '220×220×250mm', 'FDM', true),
('Creality', 'K1', 350, '220×220×250mm', 'FDM', true),
('Creality', 'K1 Max', 450, '300×300×300mm', 'FDM', true),
('Creality', 'K2 Plus', 600, '350×350×350mm', 'FDM', true),
('Creality', 'CR-10 Smart Pro', 500, '300×300×400mm', 'FDM', true),
-- Artillery
('Artillery', 'Sidewinder X1', 300, '300×300×400mm', 'FDM', true),
('Artillery', 'Sidewinder X2', 300, '300×300×400mm', 'FDM', true),
('Artillery', 'Sidewinder X3 Pro', 300, '240×240×260mm', 'FDM', true),
('Artillery', 'Sidewinder X3 Plus', 300, '300×300×400mm', 'FDM', true),
('Artillery', 'Genius', 300, '220×220×250mm', 'FDM', true),
('Artillery', 'Genius Pro', 300, '220×220×250mm', 'FDM', true),
('Artillery', 'Hornet', 200, '220×220×250mm', 'FDM', true),
-- Elegoo
('Elegoo', 'Neptune 4 Pro', 350, '235×235×265mm', 'FDM', true),
('Elegoo', 'Neptune 4 Max', 500, '420×420×480mm', 'FDM', true),
('Elegoo', 'Saturn 4 Ultra', 250, '218×123×260mm', 'MSLA', true),
('Elegoo', 'Mars 5 Ultra', 100, '143×89×165mm', 'MSLA', true),
-- Anycubic
('Anycubic', 'Kobra 3', 350, '250×250×260mm', 'FDM', true),
('Anycubic', 'Kobra 3 Max', 600, '400×400×450mm', 'FDM', true),
('Anycubic', 'Photon Mono M7 Pro', 100, '200×124×235mm', 'MSLA', true),
-- Voron
('Voron', 'Trident 250', 800, '250×250×250mm', 'FDM', true),
('Voron', 'Trident 300', 900, '300×300×300mm', 'FDM', true),
('Voron', 'V2.4 350', 1200, '350×350×350mm', 'FDM', true),
-- Flashforge
('Flashforge', 'Adventurer 5M Pro', 400, '220×220×220mm', 'FDM', true),
('Flashforge', 'Creator 4', 1000, '400×350×500mm', 'FDM', true),
-- Qidi
('Qidi', 'X-Max 3', 600, '320×320×340mm', 'FDM', true),
('Qidi', 'Q1 Pro', 350, '245×245×245mm', 'FDM', true);

-- =============================================
-- SEED DATA - Filaments
-- =============================================
INSERT INTO filaments (brand, material, color_name, color_hex, price_per_kg, density_g_cm3, verified) VALUES
-- eSUN
('eSUN', 'PLA+', 'Blanco', '#FFFFFF', 18.99, 1.24, true),
('eSUN', 'PLA+', 'Negro', '#1A1A1A', 18.99, 1.24, true),
('eSUN', 'PLA+', 'Rojo', '#CC0000', 18.99, 1.24, true),
('eSUN', 'PLA+', 'Azul', '#0055CC', 18.99, 1.24, true),
('eSUN', 'PETG', 'Transparente', '#E8F4F8', 22.99, 1.27, true),
('eSUN', 'PETG', 'Negro', '#1A1A1A', 22.99, 1.27, true),
('eSUN', 'ABS+', 'Blanco', '#F5F5F5', 19.99, 1.08, true),
('eSUN', 'TPU 95A', 'Negro', '#222222', 28.99, 1.21, true),
('eSUN', 'ASA', 'Gris', '#808080', 24.99, 1.07, true),
-- Bambu Lab
('Bambu Lab', 'PLA Basic', 'Bambu Green', '#4CAF50', 24.99, 1.24, true),
('Bambu Lab', 'PLA Basic', 'Blanco', '#FAFAFA', 19.99, 1.24, true),
('Bambu Lab', 'PLA Basic', 'Negro', '#111111', 19.99, 1.24, true),
('Bambu Lab', 'PLA Matte', 'Charcoal', '#36454F', 27.99, 1.24, true),
('Bambu Lab', 'PETG HF', 'Transparente', '#E0F0F8', 29.99, 1.27, true),
('Bambu Lab', 'ABS', 'Blanco', '#F8F8F8', 24.99, 1.08, true),
('Bambu Lab', 'ASA', 'Negro', '#111111', 29.99, 1.07, true),
('Bambu Lab', 'TPU 95A HF', 'Negro', '#1A1A1A', 34.99, 1.21, true),
('Bambu Lab', 'PLA-CF', 'Negro', '#0A0A0A', 44.99, 1.31, true),
('Bambu Lab', 'PA6-CF', 'Negro', '#111111', 74.99, 1.18, true),
-- Prusament
('Prusament', 'PLA', 'Galaxy Silver', '#C0C0C0', 29.99, 1.24, true),
('Prusament', 'PLA', 'Jet Black', '#0A0A0A', 29.99, 1.24, true),
('Prusament', 'PLA', 'Urban Grey Matt', '#888888', 29.99, 1.24, true),
('Prusament', 'PETG', 'Prusa Orange', '#FA6831', 32.99, 1.27, true),
('Prusament', 'PETG', 'Jet Black', '#111111', 32.99, 1.27, true),
('Prusament', 'ASA', 'Solar Yellow', '#FFD700', 34.99, 1.07, true),
-- Polymaker
('Polymaker', 'PolyLite PLA', 'Blanco', '#FFFFFF', 21.99, 1.24, true),
('Polymaker', 'PolyTerra PLA', 'Army Green', '#4A5240', 23.99, 1.24, true),
('Polymaker', 'PolyMax PETG', 'Negro', '#111111', 34.99, 1.27, true),
('Polymaker', 'PolyFlex TPU95', 'Negro', '#222222', 35.99, 1.21, true),
('Polymaker', 'PC-Max', 'Negro', '#0A0A0A', 49.99, 1.20, true),
-- Sunlu
('Sunlu', 'PLA+', 'Blanco', '#FAFAFA', 15.99, 1.24, true),
('Sunlu', 'PLA+', 'Negro', '#111111', 15.99, 1.24, true),
('Sunlu', 'PETG', 'Transparente', '#E8F0F4', 17.99, 1.27, true),
('Sunlu', 'TPU 95A', 'Negro', '#1A1A1A', 22.99, 1.21, true),
-- Hatchbox
('Hatchbox', 'PLA', 'Blanco', '#FFFFFF', 22.99, 1.24, true),
('Hatchbox', 'PLA', 'Negro', '#111111', 22.99, 1.24, true),
('Hatchbox', 'PETG', 'Claro', '#F5FBFF', 25.99, 1.27, true),
-- Fiberlogy
('Fiberlogy', 'Easy PLA', 'Gris', '#909090', 23.99, 1.24, true),
('Fiberlogy', 'PETG', 'Navy Blue', '#001F5B', 27.99, 1.27, true),
('Fiberlogy', 'Fiberflex 40D', 'Negro', '#111111', 42.99, 1.20, true);
