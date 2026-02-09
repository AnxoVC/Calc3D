import { useDataStore, type Budget } from "@/store/useDataStore"
import { Button } from "./ui/button"
import { Trash2, FileText, Calendar, Printer } from "lucide-react"

export function BudgetList() {
    const { budgets, removeBudget } = useDataStore()

    const handlePrint = (budget: Budget) => {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
            <html>
                <head>
                    <title>Presupuesto - ${budget.name}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; max-width: 800px; mx-auto; }
                        h1 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                        .details { margin-top: 20px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 5px; }
                        .total { margin-top: 30px; font-size: 1.5em; font-weight: bold; text-align: right; }
                        .footer { margin-top: 50px; font-size: 0.8em; color: #777; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Presupuesto: ${budget.name}</h1>
                    <p>Fecha: ${new Date(budget.date).toLocaleDateString()}</p>
                    
                    <div class="details">
                        <div class="item">
                            <strong>Impresora:</strong>
                            <span>${budget.printerName}</span>
                        </div>
                        <div class="item">
                            <strong>Filamento:</strong>
                            <span>${budget.filamentName}</span>
                        </div>
                         <div class="item">
                            <strong>Tiempo de Impresión:</strong>
                            <span>${Math.floor(budget.printTime / 60)}h ${budget.printTime % 60}m</span>
                        </div>
                        <div class="item">
                            <strong>Peso Material:</strong>
                            <span>${budget.weight} g</span>
                        </div>
                         <div class="item">
                            <strong>Coste Producción:</strong>
                            <span>${budget.totalCost.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div class="total">
                        Precio Final: ${budget.salePrice.toFixed(2)} €
                    </div>

                    <div class="footer">
                        Generado con Calc3D
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `)
            printWindow.document.close()
        }
    }

    if (budgets.length === 0) {
        return (
            <div className="text-center py-20 bg-secondary/10 rounded-xl border border-dashed border-border">
                <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No hay presupuestos guardados</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Utiliza la calculadora de costes para generar y guardar tus primeros presupuestos.
                </p>
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
                <div key={budget.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg leading-tight mb-1">{budget.name}</h3>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(budget.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm">
                                {budget.salePrice.toFixed(2)} €
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-foreground/80 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Impresora:</span>
                                <span className="font-medium truncate max-w-[150px]" title={budget.printerName}>{budget.printerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Filamento:</span>
                                <span className="font-medium truncate max-w-[150px]" title={budget.filamentName}>{budget.filamentName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Peso:</span>
                                <span className="font-medium">{budget.weight}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Coste real:</span>
                                <span className="font-medium">{budget.totalCost.toFixed(2)} €</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePrint(budget)}>
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimir
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeBudget(budget.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
