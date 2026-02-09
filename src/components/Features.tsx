import { FileText, Coins, Palette, CheckCircle2 } from "lucide-react"

const features = [
    {
        title: "Registro de Impresiones",
        description: "Guarda un historial completo de cada trabajo. Registra tiempos, parámetros y resultado final.",
        icon: FileText,
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        title: "Cálculo de Presupuestos",
        description: "Algoritmo preciso para calcular costes de material, electricidad y amortización de máquina.",
        icon: Coins,
        color: "bg-green-500/10 text-green-500",
    },
    {
        title: "Gestión de Filamentos",
        description: "Controla tu inventario. Sabe exactamente cuántos gramos quedan en cada bobina.",
        icon: Palette,
        color: "bg-purple-500/10 text-purple-500",
    },
]

export function Features() {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para tu granja 3D</h2>
                    <p className="text-muted-foreground">
                        Diseñado por makers para makers. Simplifica la gestión de tu hobby o negocio de impresión 3D.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-4">¿Por qué usar Calc3D?</h3>
                        <ul className="space-y-3">
                            {[
                                "Interfaz moderna y fácil de usar",
                                "Modo oscuro optimizado",
                                "Datos exportables (CSV/PDF)",
                                "100% Gratuito para uso personal"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 w-full relative h-[300px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden group">
                        <div className="text-center">
                            <p className="text-white/40 font-mono text-sm mb-2">Simulación de Interfaz</p>
                            <div className="flex gap-2 justify-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full animate-pulse"></div>
                                <div className="w-12 h-2 bg-white/20 rounded-full animate-pulse delay-75"></div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-3xl -ml-10 -mb-10"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
