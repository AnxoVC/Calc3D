import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface Printer {
    id: string
    name: string
    model: string
    nozzleDiameter: number
    powerConsumption: number // Watts
    costPerHour: number // calculated or manual override
}

export interface Filament {
    id: string
    brand: string
    material: string // PLA, PETG, ABS, etc.
    color: string
    density: number // g/cm3
    weight: number // grams (initial roll weight)
    cost: number // price per roll
    remainingWeight: number // grams
}

export interface Budget {
    id: string
    name: string
    date: string
    printerName: string
    filamentName: string
    printTime: number // minutes
    weight: number // grams
    totalCost: number
    salePrice: number
}

interface DataState {
    printers: Printer[]
    filaments: Filament[]
    budgets: Budget[]
    addPrinter: (printer: Omit<Printer, 'id'>) => void
    removePrinter: (id: string) => void
    addFilament: (filament: Omit<Filament, 'id'>) => void
    removeFilament: (id: string) => void
    updateFilamentUsage: (id: string, usedWeight: number) => void
    addBudget: (budget: Omit<Budget, 'id' | 'date'>) => void
    removeBudget: (id: string) => void
}

export const useDataStore = create<DataState>()(
    persist(
        (set) => ({
            printers: [],
            filaments: [],
            budgets: [],
            addPrinter: (printer) =>
                set((state) => ({ printers: [...state.printers, { ...printer, id: uuidv4() }] })),
            removePrinter: (id) =>
                set((state) => ({ printers: state.printers.filter((p) => p.id !== id) })),
            addFilament: (filament) =>
                set((state) => ({ filaments: [...state.filaments, { ...filament, id: uuidv4() }] })),
            removeFilament: (id) =>
                set((state) => ({ filaments: state.filaments.filter((f) => f.id !== id) })),
            updateFilamentUsage: (id, usedWeight) =>
                set((state) => ({
                    filaments: state.filaments.map((f) =>
                        f.id === id ? { ...f, remainingWeight: f.remainingWeight - usedWeight } : f
                    ),
                })),
            addBudget: (budget) =>
                set((state) => ({
                    budgets: [...state.budgets, {
                        ...budget,
                        id: uuidv4(),
                        date: new Date().toISOString()
                    }]
                })),
            removeBudget: (id) =>
                set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) })),
        }),
        {
            name: 'calc3d-data',
        }
    )
)
