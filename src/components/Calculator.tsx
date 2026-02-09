import { useState, useEffect } from "react"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "./ui/button"
import { Calculator as CalculatorIcon, Save } from "lucide-react"

export function Calculator() {
    const { printers, filaments, addBudget } = useDataStore()

    // State
    const [selectedPrinterId, setSelectedPrinterId] = useState("")
    const [selectedFilamentId, setSelectedFilamentId] = useState("")
    const [printTimeHours, setPrintTimeHours] = useState(0)
    const [printTimeMinutes, setPrintTimeMinutes] = useState(0)
    const [grams, setGrams] = useState(0)
    const [electricityCost, setElectricityCost] = useState(0.15) // EUR/kWh
    const [margin, setMargin] = useState(30) // %
    const [budgetName, setBudgetName] = useState("")

    // Results
    const [results, setResults] = useState({
        materialCost: 0,
        electricityCost: 0,
        totalCost: 0,
        salePrice: 0
    })

    // Calculate whenever inputs change
    useEffect(() => {
        const printer = printers.find(p => p.id === selectedPrinterId)
        const filament = filaments.find(f => f.id === selectedFilamentId)

        let matCost = 0
        let elecCost = 0

        if (filament && grams > 0) {
            // Cost per gram = (cost / initial_weight)
            const costPerGram = filament.cost / filament.weight
            matCost = grams * costPerGram
        }

        if (printer) {
            // Electricity: (Watts / 1000) * hours * cost_kwh
            const totalHours = printTimeHours + (printTimeMinutes / 60)
            elecCost = (printer.powerConsumption / 1000) * totalHours * electricityCost

            // Add printer hourly cost (maintenance/depreciation)
            elecCost += printer.costPerHour * totalHours
        }

        const total = matCost + elecCost
        const sale = total * (1 + (margin / 100))

        setResults({
            materialCost: matCost,
            electricityCost: elecCost,
            totalCost: total,
            salePrice: sale
        })

    }, [selectedPrinterId, selectedFilamentId, printTimeHours, printTimeMinutes, grams, electricityCost, margin, printers, filaments])


    const handleSaveBudget = () => {
        if (!budgetName) return
        const printer = printers.find(p => p.id === selectedPrinterId)
        const filament = filaments.find(f => f.id === selectedFilamentId)

        addBudget({
            name: budgetName,
            printerName: printer ? printer.name : "Desconocida",
            filamentName: filament ? `${filament.brand} ${filament.material}` : "Desconocido",
            printTime: (printTimeHours * 60) + printTimeMinutes,
            weight: grams,
            totalCost: results.totalCost,
            salePrice: results.salePrice
        })

        // Reset name after save or show notification (simplified for now)
        setBudgetName("")
        alert("Presupuesto guardado!")
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-card border rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <CalculatorIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Calculadora de Costes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* INPUTS */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Seleccionar Impresora</label>
                        <select
                            className="w-full bg-secondary/50 border border-input rounded p-2"
                            value={selectedPrinterId}
                            onChange={(e) => setSelectedPrinterId(e.target.value)}
                        >
                            <option value="">-- Selecciona --</option>
                            {printers.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.model})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Seleccionar Filamento</label>
                        <select
                            className="w-full bg-secondary/50 border border-input rounded p-2"
                            value={selectedFilamentId}
                            onChange={(e) => setSelectedFilamentId(e.target.value)}
                        >
                            <option value="">-- Selecciona --</option>
                            {filaments.map(f => (
                                <option key={f.id} value={f.id}>{f.brand} {f.material} - {f.color}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Tiempo (Horas)</label>
                            <input
                                type="number"
                                min="0"
                                value={printTimeHours}
                                onChange={(e) => setPrintTimeHours(parseInt(e.target.value) || 0)}
                                className="w-full bg-secondary/50 border border-input rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Minutos</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={printTimeMinutes}
                                onChange={(e) => setPrintTimeMinutes(parseInt(e.target.value) || 0)}
                                className="w-full bg-secondary/50 border border-input rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Peso (g)</label>
                            <input
                                type="number"
                                min="0"
                                value={grams}
                                onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
                                className="w-full bg-secondary/50 border border-input rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Coste Elec. (€/kWh)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={electricityCost}
                                onChange={(e) => setElectricityCost(parseFloat(e.target.value) || 0)}
                                className="w-full bg-secondary/50 border border-input rounded p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Margen de Beneficio (%)</label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={margin}
                            onChange={(e) => setMargin(parseInt(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="text-right text-xs text-muted-foreground">{margin}%</div>
                    </div>

                </div>

                {/* RESULTS */}
                <div className="bg-secondary/20 rounded-xl p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Resumen de Costes</h3>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Coste Material:</span>
                            <span className="font-medium">{results.materialCost.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Coste Energía + Máquina:</span>
                            <span className="font-medium">{results.electricityCost.toFixed(2)} €</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                            <span>Coste Total:</span>
                            <span>{results.totalCost.toFixed(2)} €</span>
                        </div>

                        <div className="mt-8 bg-background p-4 rounded-lg border border-primary/20 shadow-sm">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Precio de Venta Sugerido</p>
                            <p className="text-3xl font-bold text-primary">{results.salePrice.toFixed(2)} €</p>
                            <p className="text-xs text-green-500 mt-1">Beneficio: {(results.salePrice - results.totalCost).toFixed(2)} €</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border space-y-3">
                        <input
                            type="text"
                            placeholder="Nombre para este presupuesto..."
                            value={budgetName}
                            onChange={(e) => setBudgetName(e.target.value)}
                            className="w-full bg-background border border-input rounded p-2 text-sm"
                        />
                        <Button className="w-full" disabled={!budgetName || results.totalCost === 0} onClick={handleSaveBudget}>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Presupuesto
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
