import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const [formData, setFormData] = useState({
    title: "",
    keyword: "",
    description: "",
    wage: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/confirm", { state: { formData } }); // 入力値を確認画面へ渡す
  };

  return (
    <div>
      <h2>新規記事登録</h2>
      <form onSubmit={handleNext}>
        <input
          name="title"
          placeholder="タイトル"
          onChange={handleChange}
          required
        />
        <input
          name="keyword"
          placeholder="キーワード"
          onChange={handleChange}
        />
        <input name="description" placeholder="概要" onChange={handleChange} />
        <input
          name="wage"
          type="number"
          placeholder="時給"
          onChange={handleChange}
          required
        />
        <label>
          開催開始日:{" "}
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            required
          />
        </label>
        <label>
          開催終了日:{" "}
          <input type="date" name="endDate" onChange={handleChange} required />
        </label>
        <button type="submit">確認へ進む</button>
      </form>
    </div>
  );
}
