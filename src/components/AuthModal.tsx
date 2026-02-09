import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { X, Mail, Loader2, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const { login, setGuestMode } = useAuthStore()

    // Form states
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            login({
                id: "1",
                email: email,
                name: isLogin ? "Usuario Demo" : name,
            })
            setIsLoading(false)
            onClose()
        }, 1000)
    }

    const handleGuestAccess = () => {
        setGuestMode(true)
        onClose()
    }

    const handleGoogleLogin = () => {
        setIsLoading(true)
        // Simulate Google Login
        setTimeout(() => {
            login({
                id: "google-user",
                email: "google@demo.com",
                name: "Usuario Google",
            })
            setIsLoading(false)
            onClose()
        }, 1500)
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
                        className="fixed inset-0 m-auto max-w-md h-fit z-50 px-4"
                    >
                        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden glass">
                            <div className="relative p-6 pb-0">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 p-2 hover:bg-secondary rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        type="button"
                                        className={`text-lg font-semibold pb-2 transition-colors ${isLogin ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        type="button"
                                        className={`text-lg font-semibold pb-2 transition-colors ${!isLogin ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 pt-2">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!isLogin && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nombre</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Tu nombre"
                                                    className="pl-9"
                                                    value={name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                                    required={!isLogin}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="tu@email.com"
                                                className="pl-9"
                                                value={email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Contraseña</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Button className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLogin ? "Entrar" : "Crear Cuenta"}
                                    </Button>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                        Google
                                    </Button>

                                </form>

                                <div className="mt-4 text-center text-sm">
                                    <span className="text-muted-foreground">¿Solo quieres probar? </span>
                                    <button type="button" onClick={handleGuestAccess} className="text-primary hover:underline font-medium">
                                        Entrar como invitado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
