import { Button } from "./ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useDataStore } from "@/store/useDataStore"
import { Printer, Box, FileText, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { AddPrinterModal } from "./AddPrinterModal"
import { AddFilamentModal } from "./AddFilamentModal"

export function Dashboard() {
    const { user } = useAuthStore()
    const { printers, filaments, removePrinter, removeFilament } = useDataStore()

    const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false)
    const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false)

    return (
        <>
            <div className="container mx-auto px-4 py-32">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Hola, {user?.name} 👋</h1>
                        <p className="text-muted-foreground">Aquí tienes el resumen de tu actividad.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsFilamentModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Nuevo Filamento
                        </Button>
                        <Button onClick={() => setIsPrinterModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Nueva Impresora
                        </Button>
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-card glass p-6 rounded-xl border border-border/50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold">Impresiones</h3>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-muted-foreground mt-1">Total realizadas</p>
                    </div>

                    <div className="bg-card glass p-6 rounded-xl border border-border/50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold">Impresoras</h3>
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Printer className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{printers.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Configuradas</p>
                    </div>

                    <div className="bg-card glass p-6 rounded-xl border border-border/50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold">Filamentos</h3>
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                <Box className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{filaments.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Registrados</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Printers Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Mis Impresoras</h2>
                        {printers.length === 0 ? (
                            <div className="p-8 text-center border border-dashed rounded-xl bg-secondary/10">
                                <p className="text-muted-foreground text-sm">No hay impresoras configuradas</p>
                                <Button variant="link" onClick={() => setIsPrinterModalOpen(true)}>Añadir una ahora</Button>
                            </div>
                        ) : (
                            printers.map(printer => (
                                <div key={printer.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                                    <div>
                                        <p className="font-medium">{printer.name}</p>
                                        <p className="text-xs text-muted-foreground">{printer.model} • {printer.nozzleDiameter}mm</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removePrinter(printer.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Filaments Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Mis Filamentos</h2>
                        {filaments.length === 0 ? (
                            <div className="p-8 text-center border border-dashed rounded-xl bg-secondary/10">
                                <p className="text-muted-foreground text-sm">No hay filamentos registrados</p>
                                <Button variant="link" onClick={() => setIsFilamentModalOpen(true)}>Añadir uno ahora</Button>
                            </div>
                        ) : (
                            filaments.map(filament => (
                                <div key={filament.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: filament.color }}></div>
                                        <div>
                                            <p className="font-medium">{filament.brand} {filament.material}</p>
                                            <p className="text-xs text-muted-foreground">{filament.remainingWeight}g restantes</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeFilament(filament.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <AddPrinterModal isOpen={isPrinterModalOpen} onClose={() => setIsPrinterModalOpen(false)} />
            <AddFilamentModal isOpen={isFilamentModalOpen} onClose={() => setIsFilamentModalOpen(false)} />
        </>
    )
}
