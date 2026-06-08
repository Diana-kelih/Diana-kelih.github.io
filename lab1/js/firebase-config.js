// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAK2F_3IW8jhVKm922mgxC29iTtUnHuhQU",
  authDomain: "lab1-26acb.firebaseapp.com",
  databaseURL: "https://lab1-26acb-default-rtdb.firebaseio.com",
  projectId: "lab1-26acb",
  storageBucket: "lab1-26acb.appspot.com",
  messagingSenderId: "966964967281",
  appId: "1:966324967281:web:ded132e5ea00d7c6f4a8d0",
  measurementId: "G-NLDNFEND2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database reference
export const db = getDatabase(app);

console.log("Firebase initialized ✔");
