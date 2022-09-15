// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDkEKRkCR9x64xzPmRso1h72MZNgYJ2U94",
  authDomain: "hive-7d18e.firebaseapp.com",
  projectId: "hive-7d18e",
  storageBucket: "hive-7d18e.appspot.com",
  messagingSenderId: "73443725069",
  appId: "1:73443725069:web:9c5653d2bfeb19983b2a44",
});

// Initialize Firebase

const db = getFirestore();
export default db;
