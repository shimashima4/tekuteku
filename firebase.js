// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCLTuTzvUxn_PhbY2nkKbYu-rotx3gfT20",
  authDomain: "tekuteku-ac503.firebaseapp.com",
  projectId: "tekuteku-ac503",
  storageBucket: "tekuteku-ac503.firebasestorage.app",
  messagingSenderId: "456395776640",
  appId: "1:456395776640:web:86b2b6f7518dd099b6bc65",
  measurementId: "G-XCSC4JJ4NJ",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
