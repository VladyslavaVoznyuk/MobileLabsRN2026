import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyDPjgIWa7xU6744m2xUP1BkoROW6fMwDrI",
    authDomain: "lab6-b708c.firebaseapp.com",
    projectId: "lab6-b708c",
    storageBucket: "lab6-b708c.firebasestorage.app",
    messagingSenderId: "686268835202",
    appId: "1:686268835202:web:fe8da1e4a64efa81f2db9b",
    measurementId: "G-CQ9EW96321"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);