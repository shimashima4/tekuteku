import React from "react";
import JobBoard from "./components/JobBoard";
import { db } from "./firebase"; // App.js ならこの書き方
// JobBoard.jsx なら "../firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

function App() {
  return (
    <div>
      <JobBoard />
    </div>
  );
}

export default App;
