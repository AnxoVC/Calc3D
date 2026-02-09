import { create } from 'zustand'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

interface User {
    id: string
    email: string
    name: string
    photoURL?: string
}

interface AuthState {
    user: User | null
    isGuest: boolean
    isLoading: boolean
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    setGuestMode: (isGuest: boolean) => void
    setUser: (user: User | null) => void // Internal use
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isGuest: false,
    isLoading: true, // Start loading to check auth state

    loginWithGoogle: async () => {
        set({ isLoading: true })
        try {
            await signInWithPopup(auth, googleProvider)
            // onAuthStateChanged will handle the state update
        } catch (error) {
            console.error("Login failed", error)
            set({ isLoading: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })
        try {
            await signOut(auth)
            set({ user: null, isGuest: false, isLoading: false })
        } catch (error) {
            console.error("Logout failed", error)
            set({ isLoading: false })
        }
    },

    setGuestMode: (isGuest) => set({ isGuest, user: null, isLoading: false }),

    setUser: (user) => set({ user, isGuest: false, isLoading: false })
}))

// Listener for Firebase Auth changes
onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
        useAuthStore.getState().setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Usuario',
            photoURL: firebaseUser.photoURL || undefined
        })
    } else {
        // Only reset if we are not manually entering guest mode or explicitly logging out
        // valid way to check is if we previously had a user. 
        // For simplicity, we just stop loading. If guest mode was active, it stays active in component state logic ideally, 
        // but here we might reset. Let's trust the logout action to clear user. 
        // If simply refreshing page and not logged in:
        useAuthStore.getState().setUser(null)
    }
})
