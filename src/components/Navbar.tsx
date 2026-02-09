import { Button } from "./ui/button"
import { ScanFace, Menu, UserCircle, LogOut, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { AuthModal } from "./AuthModal"
import { useAuthStore } from "@/store/useAuthStore"
import { useTheme } from "./ThemeProvider"

interface NavbarProps {
    currentView?: "dashboard" | "calculator" | "budgets"
    onNavigate?: (view: "dashboard" | "calculator" | "budgets") => void
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const { user, isGuest, logout } = useAuthStore()
    const { setTheme, theme } = useTheme()

    const handleNav = (view: "dashboard" | "calculator" | "budgets", e: React.MouseEvent) => {
        e.preventDefault()
        if (onNavigate) onNavigate(view)
    }

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleNav("dashboard", e)}>
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <ScanFace className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Calc3D
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="#"
                            onClick={(e) => handleNav("dashboard", e)}
                            className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Inicio
                        </a>
                        <a
                            href="#"
                            onClick={(e) => handleNav("calculator", e)}
                            className={`text-sm font-medium transition-colors ${currentView === 'calculator' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Calculadora
                        </a>
                        {(user || isGuest) && (
                            <a
                                href="#"
                                onClick={(e) => handleNav("budgets", e)}
                                className={`text-sm font-medium transition-colors ${currentView === 'budgets' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                Mis Presupuestos
                            </a>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            title="Cambiar tema"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">Hola, {user.name}</span>
                                <Button variant="ghost" size="icon" onClick={logout} title="Cerrar Sesión">
                                    <LogOut className="w-5 h-5 text-destructive" />
                                </Button>
                            </div>
                        ) : isGuest ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Modo Invitado</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
                                <Button size="sm" onClick={() => setIsAuthOpen(true)}>Registrarse</Button>
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setIsAuthOpen(true)}>Iniciar Sesión</Button>
                                <Button onClick={() => setIsAuthOpen(true)}>Registrarse</Button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </nav>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    )
}
