import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";
import { getDatabase, ref, set, onValue, update, remove, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDlME0mBBDMt0QVfvEMle6mMOBNpCXx78A",
  authDomain: "webcraft-guard--master.firebaseapp.com",
  projectId: "webcraft-guard--master",
  storageBucket: "webcraft-guard--master.firebasestorage.app",
  messagingSenderId: "549584792270",
  appId: "1:549584792270:web:15a857d16bdb4c7d9cfe9f",
  measurementId: "G-KFF1ZNDB9F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Also initialize Realtime Database with standard URL if used
export const rtdb = getDatabase(app);
