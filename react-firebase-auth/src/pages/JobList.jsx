import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function JobList() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    minWage: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "jobs"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => setFilters({ keyword: "", minWage: "", date: "" });

  const filteredPosts = posts.filter((p) => {
    if (
      filters.keyword &&
      !(`${p.title}${p.keyword}${p.description}` || "").includes(
        filters.keyword
      )
    )
      return false;
    if (filters.minWage && Number(p.wage) < Number(filters.minWage))
      return false;
    if (filters.date && p.startDate && p.endDate) {
      const d = new Date(filters.date);
      if (d < new Date(p.startDate) || d > new Date(p.endDate)) return false;
    }
    return true;
  });

  return (
    <div>
      <h2>投稿一覧</h2>
      <div>
        <input
          name="keyword"
          placeholder="キーワード"
          value={filters.keyword}
          onChange={handleChange}
        />
        <input
          name="minWage"
          type="number"
          placeholder="最低時給"
          value={filters.minWage}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={filters.date}
          onChange={handleChange}
        />
        <button onClick={handleReset}>リセット</button>
      </div>

      <ul>
        {filteredPosts.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> / {p.keyword} / {p.wage}円 / {p.startDate} ~{" "}
            {p.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
}
