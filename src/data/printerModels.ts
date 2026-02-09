export interface PrinterModel {
    name: string
    model: string
    nozzleDiameter: number
    powerConsumption: number // Watts estimated average
    bedSize?: string // optional display info
}

export const POPULAR_PRINTERS: PrinterModel[] = [
    // Abax
    { name: "Abax PRi3", model: "Abax PRi3", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Abax PRi5", model: "Abax PRi5", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Adimlab
    { name: "Adimlab Gantry", model: "Adimlab Gantry", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Adimlab Gantry Pro", model: "Adimlab Gantry Pro", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Alfawise
    { name: "Alfawise U20", model: "Alfawise U20", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Alfawise U30", model: "Alfawise U30", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Alfawise U30 Pro", model: "Alfawise U30 Pro", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Anet
    { name: "Anet A8", model: "Anet A8", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anet A8 Plus", model: "Anet A8 Plus", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Anet A6", model: "Anet A6", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anet ET4", model: "Anet ET4", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anet ET5", model: "Anet ET5", nozzleDiameter: 0.4, powerConsumption: 200 },

    // Anycubic
    { name: "Anycubic Kobra", model: "Anycubic Kobra", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anycubic Kobra 2", model: "Anycubic Kobra 2", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Anycubic Kobra Max", model: "Anycubic Kobra Max", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Anycubic i3 Mega S", model: "Anycubic i3 Mega S", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anycubic Vyper", model: "Anycubic Vyper", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Anycubic Chiron", model: "Anycubic Chiron", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Anycubic 4Max Pro", model: "Anycubic 4Max Pro", nozzleDiameter: 0.4, powerConsumption: 250 },

    // Artillery
    { name: "Artillery Sidewinder X1", model: "Artillery Sidewinder X1", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Artillery Sidewinder X2", model: "Artillery Sidewinder X2", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Artillery Genius", model: "Artillery Genius", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Artillery Hornet", model: "Artillery Hornet", nozzleDiameter: 0.4, powerConsumption: 150 },

    // BCN3D
    { name: "BCN3D Sigma", model: "BCN3D Sigma", nozzleDiameter: 0.4, powerConsumption: 250 },
    { name: "BCN3D Epsilon W27", model: "BCN3D Epsilon W27", nozzleDiameter: 0.4, powerConsumption: 350 },

    // BIQU
    { name: "BIQU B1", model: "BIQU B1", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "BIQU Hurakan", model: "BIQU Hurakan", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Bambu Lab
    { name: "Bambu Lab X1 Carbon", model: "Bambu Lab X1 Carbon", nozzleDiameter: 0.4, powerConsumption: 350 },
    { name: "Bambu Lab P1P", model: "Bambu Lab P1P", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Bambu Lab P1S", model: "Bambu Lab P1S", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Bambu Lab A1", model: "Bambu Lab A1", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Bambu Lab A1 Mini", model: "Bambu Lab A1 Mini", nozzleDiameter: 0.4, powerConsumption: 100 },

    // Creality
    { name: "Creality Ender 3", model: "Creality Ender 3", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Creality Ender 3 V2", model: "Creality Ender 3 V2", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Creality Ender 3 S1", model: "Creality Ender 3 S1", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Creality Ender 3 V3", model: "Creality Ender 3 V3", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Creality 5 Pro", model: "Creality Ender 5 Pro", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Creality 5 Plus", model: "Creality Ender 5 Plus", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Creality CR-10", model: "Creality CR-10", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Creality K1", model: "Creality K1", nozzleDiameter: 0.4, powerConsumption: 350 },
    { name: "Creality K1 Max", model: "Creality K1 Max", nozzleDiameter: 0.4, powerConsumption: 400 },

    // Elegoo
    { name: "Elegoo Neptune 2", model: "Elegoo Neptune 2", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Elegoo Neptune 3 Pro", model: "Elegoo Neptune 3 Pro", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Elegoo Neptune 4", model: "Elegoo Neptune 4", nozzleDiameter: 0.4, powerConsumption: 250 },
    { name: "Elegoo Neptune 4 Max", model: "Elegoo Neptune 4 Max", nozzleDiameter: 0.4, powerConsumption: 350 },

    // FLSun
    { name: "FLSun Q5", model: "FLSun Q5", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "FLSun SR", model: "FLSun Super Racer", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "FLSun V400", model: "FLSun V400", nozzleDiameter: 0.4, powerConsumption: 300 },

    // FlashForge
    { name: "FlashForge Creator Pro", model: "FlashForge Creator Pro", nozzleDiameter: 0.4, powerConsumption: 250 },
    { name: "FlashForge Adventurer 3", model: "FlashForge Adventurer 3", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Geeetech
    { name: "Geeetech A10", model: "Geeetech A10", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Geeetech A20M", model: "Geeetech A20M", nozzleDiameter: 0.4, powerConsumption: 200 },

    // Kingroon
    { name: "Kingroon KP3S", model: "Kingroon KP3S", nozzleDiameter: 0.4, powerConsumption: 100 },

    // Prusa
    { name: "Prusa i3 MK3S+", model: "Prusa i3 MK3S+", nozzleDiameter: 0.4, powerConsumption: 120 },
    { name: "Prusa MK4", model: "Prusa MK4", nozzleDiameter: 0.4, powerConsumption: 120 },
    { name: "Prusa Mini+", model: "Prusa Mini+", nozzleDiameter: 0.4, powerConsumption: 80 },

    // Snapmaker
    { name: "Snapmaker A350", model: "Snapmaker A350", nozzleDiameter: 0.4, powerConsumption: 300 },

    // Sovol
    { name: "Sovol SV06", model: "Sovol SV06", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Sovol SV07", model: "Sovol SV07", nozzleDiameter: 0.4, powerConsumption: 200 },

    // Tronxy
    { name: "Tronxy X5SA", model: "Tronxy X5SA", nozzleDiameter: 0.4, powerConsumption: 200 },

    // Two Trees
    { name: "Two Trees Bluer", model: "Two Trees Bluer", nozzleDiameter: 0.4, powerConsumption: 150 },
    { name: "Two Trees Sapphire", model: "Two Trees Sapphire", nozzleDiameter: 0.4, powerConsumption: 200 },

    // Ultimaker
    { name: "Ultimaker S3", model: "Ultimaker S3", nozzleDiameter: 0.4, powerConsumption: 200 },
    { name: "Ultimaker S5", model: "Ultimaker S5", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Ultimaker 2+", model: "Ultimaker 2+", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Voxelab
    { name: "Voxelab Aquila", model: "Voxelab Aquila", nozzleDiameter: 0.4, powerConsumption: 150 },

    // Voron (Community)
    { name: "Voron 2.4", model: "Voron 2.4", nozzleDiameter: 0.4, powerConsumption: 350 },
    { name: "Voron Trident", model: "Voron Trident", nozzleDiameter: 0.4, powerConsumption: 300 },
    { name: "Voron 0.2", model: "Voron 0.2", nozzleDiameter: 0.4, powerConsumption: 100 },
].sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
