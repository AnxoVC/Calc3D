-- =============================================
-- MyCalc3D - Migración: Actualizar consumos de impresoras
-- Fecha: 2026-04-18
-- Descripción: Actualiza los vatios (wattage_w) de todas las impresoras
--              con datos verificados de las webs oficiales de fabricantes.
--
-- INSTRUCCIONES: Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Bambu Lab (fuente: bambulab.com - specs oficiales)
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Bambu Lab' AND model = 'X1 Carbon';
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Bambu Lab' AND model = 'X1E';
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Bambu Lab' AND model = 'P1S';
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Bambu Lab' AND model = 'P1P';
UPDATE printers SET wattage_w = 150  WHERE brand = 'Bambu Lab' AND model = 'A1 Mini';
UPDATE printers SET wattage_w = 1100 WHERE brand = 'Bambu Lab' AND model = 'A1';

-- Prusa (fuente: prusa3d.com - specs oficiales)
UPDATE printers SET wattage_w = 250  WHERE brand = 'Prusa' AND model = 'MK4';
UPDATE printers SET wattage_w = 240  WHERE brand = 'Prusa' AND model = 'MK3S+';
UPDATE printers SET wattage_w = 720  WHERE brand = 'Prusa' AND model = 'XL';
UPDATE printers SET wattage_w = 150  WHERE brand = 'Prusa' AND model = 'MINI+';
UPDATE printers SET wattage_w = 100  WHERE brand = 'Prusa' AND model = 'SL1S Speed';

-- Creality (fuente: creality.com - specs oficiales)
UPDATE printers SET wattage_w = 350  WHERE brand = 'Creality' AND model = 'Ender 3 V3';
UPDATE printers SET wattage_w = 350  WHERE brand = 'Creality' AND model = 'Ender 3 V3 SE';
UPDATE printers SET wattage_w = 350  WHERE brand = 'Creality' AND model = 'K1';
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Creality' AND model = 'K1 Max';
UPDATE printers SET wattage_w = 900  WHERE brand = 'Creality' AND model = 'K2 Plus';
UPDATE printers SET wattage_w = 350  WHERE brand = 'Creality' AND model = 'CR-10 Smart Pro';

-- Artillery (fuente: specs oficiales / 3djake.com)
UPDATE printers SET wattage_w = 650  WHERE brand = 'Artillery' AND model = 'Sidewinder X1';
UPDATE printers SET wattage_w = 700  WHERE brand = 'Artillery' AND model = 'Sidewinder X2';
UPDATE printers SET wattage_w = 300  WHERE brand = 'Artillery' AND model = 'Sidewinder X3 Pro';
UPDATE printers SET wattage_w = 350  WHERE brand = 'Artillery' AND model = 'Sidewinder X3 Plus';
UPDATE printers SET wattage_w = 400  WHERE brand = 'Artillery' AND model = 'Genius';
UPDATE printers SET wattage_w = 500  WHERE brand = 'Artillery' AND model = 'Genius Pro';
UPDATE printers SET wattage_w = 240  WHERE brand = 'Artillery' AND model = 'Hornet';

-- Elegoo (fuente: elegoo.com - specs oficiales)
UPDATE printers SET wattage_w = 400  WHERE brand = 'Elegoo' AND model = 'Neptune 4 Pro';
UPDATE printers SET wattage_w = 450  WHERE brand = 'Elegoo' AND model = 'Neptune 4 Max';
UPDATE printers SET wattage_w = 144  WHERE brand = 'Elegoo' AND model = 'Saturn 4 Ultra';
UPDATE printers SET wattage_w = 72   WHERE brand = 'Elegoo' AND model = 'Mars 5 Ultra';

-- Anycubic (fuente: anycubic.com - specs oficiales)
UPDATE printers SET wattage_w = 200  WHERE brand = 'Anycubic' AND model = 'Kobra 3';
UPDATE printers SET wattage_w = 300  WHERE brand = 'Anycubic' AND model = 'Kobra 3 Max';
UPDATE printers SET wattage_w = 240  WHERE brand = 'Anycubic' AND model = 'Photon Mono M7 Pro';

-- Voron (fuente: comunidad Voron / reddit - DIY, varía según build)
UPDATE printers SET wattage_w = 600  WHERE brand = 'Voron' AND model = 'Trident 250';
UPDATE printers SET wattage_w = 750  WHERE brand = 'Voron' AND model = 'Trident 300';
UPDATE printers SET wattage_w = 1000 WHERE brand = 'Voron' AND model = 'V2.4 350';

-- Flashforge (fuente: flashforge.com - specs oficiales)
UPDATE printers SET wattage_w = 350  WHERE brand = 'Flashforge' AND model = 'Adventurer 5M Pro';
UPDATE printers SET wattage_w = 2320 WHERE brand = 'Flashforge' AND model = 'Creator 4';

-- Qidi (fuente: 3dprintbeginner.com reviews / specs oficiales)
UPDATE printers SET wattage_w = 900  WHERE brand = 'Qidi' AND model = 'X-Max 3';
UPDATE printers SET wattage_w = 650  WHERE brand = 'Qidi' AND model = 'Q1 Pro';

-- Verificar resultados
SELECT brand, model, wattage_w, type FROM printers ORDER BY brand, model;
