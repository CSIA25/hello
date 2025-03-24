import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSINX_-mhb6j_jk84IkJN7r-HheqT3lOQ",
  authDomain: "mero-samaj.firebaseapp.com",
  projectId: "mero-samaj",
  storageBucket: "mero-samaj.firebasestorage.app",
  messagingSenderId: "1012862990546",
  appId: "1:1012862990546:web:209151948e55a3c0d1d50b",
  measurementId: "G-FS7L1HMWGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
