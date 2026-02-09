
export function Footer() {
    return (
        <footer className="py-8 border-t border-border bg-background">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Calc3D. Creado con ❤️ para la comunidad 3D.
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacidad</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Términos</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contacto</a>
                </div>
            </div>
        </footer>
    )
}
