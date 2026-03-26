import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJBimKwUKSoANAIoy5p9aKVr5z7SifJF0",
  authDomain: "family-binge.firebaseapp.com",
  projectId: "family-binge",
  storageBucket: "family-binge.firebasestorage.app",
  messagingSenderId: "270385704188",
  appId: "1:270385704188:web:a21f6b35e0dd4c7ee13b79",
  measurementId: "G-Q4J010D7ML"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);