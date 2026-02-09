import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxJtVSL80o2sxao24UEdhfe3RxmX7jrLQ",
    authDomain: "calc3d-c2805.firebaseapp.com",
    projectId: "calc3d-c2805",
    storageBucket: "calc3d-c2805.firebasestorage.app",
    messagingSenderId: "952053028203",
    appId: "1:952053028203:web:6cf5207de4ff6e1c71282e",
    measurementId: "G-37K7B447T9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
