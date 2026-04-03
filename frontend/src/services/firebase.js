import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVc5NCQ8veu-AVQt3EA9DcH6KWEueEVv4",
  authDomain: "family-binge-86da4.firebaseapp.com",
  projectId: "family-binge-86da4",
  storageBucket: "family-binge-86da4.firebasestorage.app",
  messagingSenderId: "1067511376542",
  appId: "1:1067511376542:web:bcbec7a4fb2b623727298f",
  measurementId: "G-WGQVQB5VLJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
