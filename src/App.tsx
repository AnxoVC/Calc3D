import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { Footer } from "@/components/Footer"
import { Dashboard } from "@/components/Dashboard"
import { Calculator } from "@/components/Calculator"
import { BudgetList } from "@/components/BudgetList"
import { useAuthStore } from "@/store/useAuthStore"
import { useDataStore } from "@/store/useDataStore"
import { useState, useEffect } from "react"

function App() {
  const { user, isGuest } = useAuthStore()
  const { loadFromFirestore } = useDataStore()
  const isAuthenticated = user || isGuest
  const [currentView, setCurrentView] = useState<"dashboard" | "calculator" | "budgets">("dashboard")

  // Sync data when user logs in
  useEffect(() => {
    if (user?.id) {
      loadFromFirestore(user.id)
    }
  }, [user, loadFromFirestore])

  const renderContent = () => {
    switch (currentView) {
      case "calculator":
        return <div className="container mx-auto px-4 py-24"><Calculator /></div>
      case "budgets":
        return (
          <div className="container mx-auto px-4 py-24">
            <h2 className="text-3xl font-bold mb-8">Mis Presupuestos</h2>
            <BudgetList />
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main>
        {isAuthenticated ? (
          renderContent()
        ) : (
          <>
            <Hero />
            <Features />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
export default App
