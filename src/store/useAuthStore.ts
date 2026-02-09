import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    name: string
}

interface AuthState {
    user: User | null
    isGuest: boolean
    isLoading: boolean
    login: (userData: User) => void
    logout: () => void
    setLoading: (isLoading: boolean) => void
    setGuestMode: (isGuest: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isGuest: false,
            isLoading: false,
            login: (userData) => set({ user: userData, isGuest: false }),
            logout: () => set({ user: null, isGuest: false }),
            setLoading: (isLoading) => set({ isLoading }),
            setGuestMode: (isGuest) => set({ isGuest, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)
