
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwPbMxW8w-fXzrE2mNA8AHK3EmyO0PwBI",
  authDomain: "dsw02b1-test-43cc8.firebaseapp.com",
  projectId: "dsw02b1-test-43cc8",
  storageBucket: "dsw02b1-test-43cc8.firebasestorage.app",
  messagingSenderId: "842354129187",
  appId: "1:842354129187:web:cecf2e4bf68daab4a47496"
};


// Start Firebase
const app = initializeApp(firebaseConfig);

// Connect to Cloud Firestore
export const db = getFirestore(app);
export const db = getFirestore(app);