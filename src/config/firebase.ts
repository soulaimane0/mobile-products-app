// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8Ankd42vy2pYdOAx-vTfyaf9iDM1d-lw",
  authDomain: "productsapp-7b90d.firebaseapp.com",
  projectId: "productsapp-7b90d",
  storageBucket: "productsapp-7b90d.firebasestorage.app",
  messagingSenderId: "784582216226",
  appId: "1:784582216226:web:4a7d91d0dabd991390187b",
  measurementId: "G-CNXSY4ZJDC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export default app;
