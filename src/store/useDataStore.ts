import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from './useAuthStore'

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
    loadFromFirestore: (userId: string) => Promise<void>
}

// Helper to save current state to Firestore
const saveToFirestore = async (state: DataState) => {
    const user = useAuthStore.getState().user
    if (!user) return

    try {
        await setDoc(doc(db, "users", user.id), {
            printers: state.printers,
            filaments: state.filaments,
            budgets: state.budgets,
            lastUpdated: new Date().toISOString()
        })
    } catch (error) {
        console.error("Error saving to Firestore:", error)
    }
}

export const useDataStore = create<DataState>()(
    persist(
        (set, get) => ({
            printers: [],
            filaments: [],
            budgets: [],

            addPrinter: (printer) => {
                set((state) => ({ printers: [...state.printers, { ...printer, id: uuidv4() }] }))
                saveToFirestore(get())
            },
            removePrinter: (id) => {
                set((state) => ({ printers: state.printers.filter((p) => p.id !== id) }))
                saveToFirestore(get())
            },
            addFilament: (filament) => {
                set((state) => ({ filaments: [...state.filaments, { ...filament, id: uuidv4() }] }))
                saveToFirestore(get())
            },
            removeFilament: (id) => {
                set((state) => ({ filaments: state.filaments.filter((f) => f.id !== id) }))
                saveToFirestore(get())
            },
            updateFilamentUsage: (id, usedWeight) => {
                set((state) => ({
                    filaments: state.filaments.map((f) =>
                        f.id === id ? { ...f, remainingWeight: f.remainingWeight - usedWeight } : f
                    ),
                }))
                saveToFirestore(get())
            },
            addBudget: (budget) => {
                set((state) => ({
                    budgets: [...state.budgets, {
                        ...budget,
                        id: uuidv4(),
                        date: new Date().toISOString()
                    }]
                }))
                saveToFirestore(get())
            },
            removeBudget: (id) => {
                set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }))
                saveToFirestore(get())
            },

            loadFromFirestore: async (userId) => {
                try {
                    const docRef = doc(db, "users", userId)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        set({
                            printers: data.printers || [],
                            filaments: data.filaments || [],
                            budgets: data.budgets || []
                        })
                    } else {
                        // Optional: if new user, maybe save current local data to cloud?
                        // For now, we trust local data if cloud is empty, OR we start empty.
                        // Let's keep local data if cloud is empty to allow "syncing up" initial work
                        console.log("No cloud data found, keeping local or starting fresh.")
                        saveToFirestore(get()) // Sync basic structure up
                    }
                } catch (error) {
                    console.error("Error loading from Firestore:", error)
                }
            }
        }),
        {
            name: 'calc3d-data',
        }
    )
)
