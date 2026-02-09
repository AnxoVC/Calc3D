import { useState } from "react"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "./ui/button"
import { X, Box } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { POPULAR_FILAMENT_BRANDS } from "@/data/filamentBrands"

interface AddFilamentModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddFilamentModal({ isOpen, onClose }: AddFilamentModalProps) {
    const { addFilament } = useDataStore()

    // Use strings for numbers to allow empty input (clearing zeros)
    const [formData, setFormData] = useState({
        brand: "",
        material: "PLA",
        color: "#ff0000",
        weight: "1000",
        cost: "19.99"
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Convert back to numbers
        const weightVal = parseFloat(formData.weight) || 0
        const costVal = parseFloat(formData.cost) || 0

        addFilament({
            brand: formData.brand,
            material: formData.material,
            color: formData.color,
            density: 1.24, // Default value internally if needed, but removed from UI
            weight: weightVal,
            cost: costVal,
            remainingWeight: weightVal // Initially full
        })

        onClose()
        setFormData({ // Reset
            brand: "",
            material: "PLA",
            color: "#ff0000",
            weight: "1000",
            cost: "19.99"
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                                    <Box className="w-4 h-4 text-orange-500" />
                                    Nuevo Filamento
                                </h3>
                                <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Marca</label>
                                        <input
                                            list="filament-brands"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            placeholder="Seleccionar o escribir..."
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                            required
                                        />
                                        <datalist id="filament-brands">
                                            {POPULAR_FILAMENT_BRANDS.map(brand => (
                                                <option key={brand} value={brand} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Material</label>
                                        <select
                                            name="material"
                                            value={formData.material}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        >
                                            <option value="PLA">PLA</option>
                                            <option value="PETG">PETG</option>
                                            <option value="ABS">ABS</option>
                                            <option value="TPU">TPU</option>
                                            <option value="ASA">ASA</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            className="h-9 w-12 rounded cursor-pointer border border-input p-1 bg-secondary/50"
                                        />
                                        <input
                                            name="colorText"
                                            value={formData.color}
                                            readOnly
                                            className="flex-1 bg-secondary/50 border border-input rounded p-2 text-sm text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Peso (g)</label>
                                        <input
                                            name="weight"
                                            type="number"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Coste (€)</label>
                                        <input
                                            name="cost"
                                            type="number"
                                            step="0.01"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-input rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-2">Guardar Filamento</Button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
