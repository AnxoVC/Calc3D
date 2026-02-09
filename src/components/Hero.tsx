import { Button } from "./ui/button"
import { ArrowRight, Printer, Box } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4 text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-primary">Gestiona tus impresiones 3D profesionalmente</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    Tu estudio de impresión <br />
                    <span className="text-primary">bajo control</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Calcula costes exactos, gestiona tu inventario de filamentos y mantén un historial detallado de cada pieza que fabricas.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/25">
                        Empezar Gratis <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-background/50 backdrop-blur-sm">
                        Ver Demo
                    </Button>
                </div>

                {/* Floating Cards Visualization */}
                <div className="mt-20 relative max-w-5xl mx-auto hidden md:block">
                    <div className="absolute top-10 -left-10 bg-card p-4 rounded-xl shadow-xl border border-white/10 glass animate-float" style={{ animationDelay: "0s" }}>
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg"><Box className="w-6 h-6 text-orange-600" /></div>
                            <div>
                                <p className="text-xs text-muted-foreground">Filamento bajo</p>
                                <p className="font-bold text-sm">PLA Rojo Mate (150g)</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-20 -right-10 bg-card p-4 rounded-xl shadow-xl border border-white/10 glass animate-float" style={{ animationDelay: "1.5s" }}>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg"><Printer className="w-6 h-6 text-green-600" /></div>
                            <div>
                                <p className="text-xs text-muted-foreground">Impresión Completada</p>
                                <p className="font-bold text-sm">Soporte Auriculares.gcode</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/5 p-2">
                        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black aspect-video flex items-center justify-center border border-white/10">
                            <p className="text-white/20 font-mono text-lg">[ Dashboard Preview Placeholder ]</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
