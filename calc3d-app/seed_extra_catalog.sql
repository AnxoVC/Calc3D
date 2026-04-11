-- ==============================================================================
-- Calc3D - Base de datos extra: Impresoras (Modelos 2024) y Filamentos (+60)
-- Instrucciones: Copia todo este código y pégalo en Supabase -> SQL Editor -> Run
-- ==============================================================================

-- 1. Añadiendo Impresoras súper recientes (2024)
INSERT INTO printers (brand, model, wattage_w, type, verified) VALUES
('Creality', 'Ender 3 V3 (CoreXZ)', 350, 'FDM', true),
('Creality', 'K2 Plus', 1200, 'FDM', true),
('Anycubic', 'Kobra 3 Combo', 400, 'FDM', true),
('Anycubic', 'Photon Mono M7 Pro', 150, 'Resina', true),
('Elegoo', 'Saturn 4', 150, 'Resina', true),
('Elegoo', 'Saturn 4 Ultra', 150, 'Resina', true),
('Elegoo', 'Mars 5', 50, 'Resina', true),
('Elegoo', 'Mars 5 Ultra', 50, 'Resina', true),
('Elegoo', 'OrangeStorm Giga', 1500, 'FDM', true),
('Phrozen', 'Sonic Mighty Revo', 150, 'Resina', true),
('Phrozen', 'Arco', 400, 'FDM', true),
('Prusa', 'Pro HT90', 500, 'FDM', true),
('Prusa', 'CORE One', 400, 'FDM', true),
('Prusa', 'MK4S', 250, 'FDM', true),
('Prusa', 'MK4S MMU3', 250, 'FDM', true),
('Prusa', 'XL (5 cabezales)', 700, 'FDM', true),
('Prusa', 'MINI+ MMU3', 150, 'FDM', true),
('Prusa', 'SL1S Speed (SLA)', 65, 'SLA', true),
('Prusa', 'CW1S (lavado/curado)', 30, 'Resina', true),
('Qidi Tech', 'Q1 Pro', 350, 'FDM', true),
('FLSun', 'S1', 500, 'FDM', true),
('FLSun', 'T1', 400, 'FDM', true),
('Bambu Lab', 'X1E (Enterprise)', 1000, 'FDM', true),

-- Snapmaker
('Snapmaker', 'Original (3 en 1)', 120, 'FDM', true),
('Snapmaker', '2.0 A150', 200, 'FDM', true),
('Snapmaker', '2.0 A250', 200, 'FDM', true),
('Snapmaker', '2.0 A350', 200, 'FDM', true),
('Snapmaker', '2.0 A250T', 200, 'FDM', true),
('Snapmaker', '2.0 A350T', 200, 'FDM', true),
('Snapmaker', 'Artisan', 300, 'FDM', true),
('Snapmaker', 'J1', 400, 'FDM', true),
('Snapmaker', 'J1s', 400, 'FDM', true)
ON CONFLICT DO NOTHING;


-- 2. Gran Base de Datos de Filamentos (Clasificados por marcas top)
INSERT INTO filaments (brand, material, color_name, color_hex, diameter_mm, price_per_kg, density_g_cm3, verified) VALUES
-- eSUN
('eSUN', 'PLA+', 'Negro', '#000000', 1.75, 21.00, 1.24, true),
('eSUN', 'PLA+', 'Blanco', '#FFFFFF', 1.75, 21.00, 1.24, true),
('eSUN', 'PLA+', 'Gris Frío', '#808080', 1.75, 21.00, 1.24, true),
('eSUN', 'PLA+', 'Rojo Fuego', '#FF0000', 1.75, 21.00, 1.24, true),
('eSUN', 'PETG', 'Negro Sólido', '#000000', 1.75, 23.00, 1.27, true),
('eSUN', 'PETG', 'Transparente', '#FFFFFF', 1.75, 23.00, 1.27, true),
('eSUN', 'ABS+', 'Negro', '#000000', 1.75, 24.00, 1.06, true),
('eSUN', 'TPU 95A', 'Negro', '#000000', 1.75, 32.00, 1.21, true),
('eSUN', 'ePA-CF (Nylon C)', 'Negro Carbón', '#1a1a1a', 1.75, 59.00, 1.24, true),

-- Polymaker
('Polymaker', 'PolyTerra PLA', 'Charcoal Black', '#2F3638', 1.75, 22.00, 1.31, true),
('Polymaker', 'PolyTerra PLA', 'Cotton White', '#F4F4F4', 1.75, 22.00, 1.31, true),
('Polymaker', 'PolyTerra PLA', 'Sunrise Orange', '#FF8C00', 1.75, 22.00, 1.31, true),
('Polymaker', 'PolyLite PETG', 'Teal', '#008080', 1.75, 26.00, 1.25, true),
('Polymaker', 'PolyMide PA6-CF', 'Black', '#111111', 1.75, 75.00, 1.17, true),
('Polymaker', 'PolyCast', 'Natural', '#E8E8E8', 1.75, 45.00, 1.10, true),

-- Sunlu
('Sunlu', 'PLA', 'Black', '#000000', 1.75, 17.00, 1.24, true),
('Sunlu', 'PLA', 'White', '#FFFFFF', 1.75, 17.00, 1.24, true),
('Sunlu', 'Silver Silk PLA', 'Plata Brillante', '#C0C0C0', 1.75, 23.00, 1.24, true),
('Sunlu', 'Gold Silk PLA', 'Oro', '#FFD700', 1.75, 23.00, 1.24, true),
('Sunlu', 'PETG', 'Blue', '#0000FF', 1.75, 18.00, 1.27, true),
('Sunlu', 'ABS', 'Red', '#FF0000', 1.75, 19.00, 1.04, true),

-- Bambu Lab
('Bambu Lab', 'PLA Basic', 'Jade White', '#FFFFFF', 1.75, 27.99, 1.24, true),
('Bambu Lab', 'PLA Basic', 'Black', '#000000', 1.75, 27.99, 1.24, true),
('Bambu Lab', 'PLA Matte', 'Matte Charcoal', '#202020', 1.75, 29.99, 1.24, true),
('Bambu Lab', 'PETG Basic', 'Transparent', '#F0F0F0', 1.75, 29.99, 1.27, true),
('Bambu Lab', 'ABS', 'Orange', '#FF6600', 1.75, 32.99, 1.04, true),
('Bambu Lab', 'ASA', 'Black', '#000000', 1.75, 36.99, 1.07, true),
('Bambu Lab', 'PAHT-CF', 'Dark Grey', '#303030', 1.75, 79.99, 1.14, true),

-- Prusament
('Prusament', 'PLA', 'Jet Black', '#0A0A0A', 1.75, 29.99, 1.24, true),
('Prusament', 'PLA', 'Galaxy Black', '#151515', 1.75, 29.99, 1.24, true),
('Prusament', 'PLA', 'Prusa Orange', '#EA610F', 1.75, 29.99, 1.24, true),
('Prusament', 'PETG', 'Galaxy Black', '#151515', 1.75, 29.99, 1.27, true),
('Prusament', 'ASA', 'Jet Black', '#0A0A0A', 1.75, 34.99, 1.07, true),
('Prusament', 'PC Blend', 'Natural', '#D0D0D0', 1.75, 49.99, 1.22, true),

-- Overture
('Overture', 'PLA', 'Negro', '#000000', 1.75, 20.00, 1.24, true),
('Overture', 'PLA', 'Gris Espacial', '#3b3b3b', 1.75, 20.00, 1.24, true),
('Overture', 'Matte PLA', 'Verde Militar', '#4B5320', 1.75, 22.00, 1.24, true),
('Overture', 'PETG', 'Clear', '#FFFFFF', 1.75, 21.00, 1.27, true),
('Overture', 'TPU', 'Azul', '#0000FF', 1.75, 28.00, 1.20, true),

-- Elegoo & Anycubic (Resinas)
('Elegoo', 'Standard Resin', 'Gris', '#808080', null, 25.00, 1.10, true),
('Elegoo', 'Plant-based Resin', 'Verde Translúcido', '#00FF00', null, 30.00, 1.10, true),
('Elegoo', 'Water Washable', 'Ceramic Grey', '#A9A9A9', null, 32.00, 1.10, true),
('Elegoo', 'ABS-Like', 'Gris Oscuro', '#404040', null, 35.00, 1.10, true),
('Anycubic', 'Standard Resin', 'Negro', '#000000', null, 26.00, 1.10, true),
('Anycubic', 'Eco Resin', 'Clear', '#FFFFFF', null, 31.00, 1.10, true),
('Anycubic', 'ABS-Like Pro2', 'Gris', '#808080', null, 36.00, 1.10, true)
ON CONFLICT DO NOTHING;
