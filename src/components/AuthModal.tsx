import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "./ui/button"
import { X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { loginWithGoogle, setGuestMode, isLoading } = useAuthStore()

    const handleGoogleLogin = async () => {
        await loginWithGoogle()
        onClose()
    }

    const handleGuestAccess = () => {
        setGuestMode(true)
        onClose()
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

                                <h2 className="text-2xl font-bold text-center mb-2">Bienvenido a Calc3D</h2>
                                <p className="text-center text-muted-foreground text-sm mb-6">
                                    Inicia sesión para sincronizar tus datos en la nube.
                                </p>
                            </div>

                            <div className="p-6 pt-2">
                                <Button variant="outline" type="button" className="w-full h-12 text-md mb-6" onClick={handleGoogleLogin} disabled={isLoading}>
                                    {!isLoading && (
                                        <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                    )}
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continuar con Google"}
                                </Button>

                                <div className="relative py-2 mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">O acceso local</span>
                                    </div>
                                </div>

                                <div className="mt-4 text-center text-sm">
                                    <button type="button" onClick={handleGuestAccess} className="text-primary hover:underline font-medium">
                                        Continuar como Invitado (Sin sincronización)
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
