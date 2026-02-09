import { useState } from "react"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "./ui/button"
import { X, Printer as PrinterIcon, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { POPULAR_PRINTERS } from "@/data/printerModels"

interface AddPrinterModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddPrinterModal({ isOpen, onClose }: AddPrinterModalProps) {
    const { addPrinter } = useDataStore()
    const [formData, setFormData] = useState({
        name: "",
        model: "",
        nozzleDiameter: 0.4,
        powerConsumption: 150,
        costPerHour: 0.2
    })

    // Helper to pre-fill data
    const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = POPULAR_PRINTERS.find(p => p.model === e.target.value)
        if (selectedModel) {
            setFormData({
                name: selectedModel.name, // Use short name as nickname default
                model: selectedModel.model,
                nozzleDiameter: selectedModel.nozzleDiameter,
                powerConsumption: selectedModel.powerConsumption,
                costPerHour: 0.2 // Default, user can change
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addPrinter(formData)
        onClose()
        setFormData({ // Reset
            name: "",
            model: "",
            nozzleDiameter: 0.4,
            powerConsumption: 150,
            costPerHour: 0.2
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === "name" || name === "model" ? value : parseFloat(value) || 0
        }))
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-sm h-fit z-50"
                    >
                        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <PrinterIcon className="w-4 h-4 text-purple-500" />
                                    Nueva Impresora
                                </h3>
                                <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 bg-secondary/20 border-b border-border">
                                <label className="text-xs font-medium mb-1 block">Relleno Rápido (Base de Datos)</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-background border border-input rounded p-2 text-sm pl-8 appearance-none"
                                        onChange={handlePresetSelect}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Seleccionar modelo popular...</option>
                                        {POPULAR_PRINTERS.map(p => (
                                            <option key={p.model} value={p.model}>{p.model}</option>
                                        ))}
                                    </select>
                                    <Search className="w-4 h-4 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Nombre (Apodo)</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej. Mi Ender 3"
                                        className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Modelo</label>
                                    <input
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="Ej. Creality Ender 3 V2"
                                        className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Boquilla (mm)</label>
                                        <input
                                            name="nozzleDiameter"
                                            type="number"
                                            step="0.1"
                                            value={formData.nozzleDiameter}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Consumo (W)</label>
                                        <input
                                            name="powerConsumption"
                                            type="number"
                                            value={formData.powerConsumption}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Coste/hora Estimado (€)</label>
                                    <input
                                        name="costPerHour"
                                        type="number"
                                        step="0.01"
                                        value={formData.costPerHour}
                                        onChange={handleChange}
                                        className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                    />
                                </div>

                                <Button type="submit" className="w-full mt-2">Guardar Impresora</Button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
