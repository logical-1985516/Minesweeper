// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtEFIY_OJfrV_jFtBhT7CDoonhNac-Mqc",
  authDomain: "minesweeper-41d7f.firebaseapp.com",
  projectId: "minesweeper-41d7f",
  storageBucket: "minesweeper-41d7f.appspot.com",
  messagingSenderId: "724819188729",
  appId: "1:724819188729:web:260a787845a85b6ecebb28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const resultsCollection = collection(db, "results-v3")