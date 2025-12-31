import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCVODIO60vORD7IGDnQEB2HOyPdzcuwIk",
    authDomain: "diamond-tuition.firebaseapp.com",
    projectId: "diamond-tuition",
    storageBucket: "diamond-tuition.firebasestorage.app",
    messagingSenderId: "449825991422",
    appId: "1:449825991422:web:ad183fd7044833831cd3af",
    measurementId: "G-5HS46KN33Q"
};

// Initialize Firebase (Client Side)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
