import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewPost from "./pages/NewPost";
import ConfirmPost from "./pages/ConfirmPost";
import PostComplete from "./pages/PostComplete";
import JobList from "./pages/JobList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewPost />} />
        <Route path="/confirm" element={<ConfirmPost />} />
        <Route path="/complete" element={<PostComplete />} />
        <Route path="/list" element={<JobList />} />
      </Routes>
    </Router>
  );
}
