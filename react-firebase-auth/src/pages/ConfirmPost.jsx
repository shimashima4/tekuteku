import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ConfirmPost() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.formData) {
    return <p>データがありません。新規登録からやり直してください。</p>;
  }

  const { formData } = state;

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        wage: Number(formData.wage),
        createdAt: new Date(),
      });
      navigate("/complete");
    } catch (err) {
      console.error("投稿失敗:", err);
      alert("投稿に失敗しました");
    }
  };

  return (
    <div>
      <h2>入力内容確認</h2>
      <p>タイトル: {formData.title}</p>
      <p>キーワード: {formData.keyword}</p>
      <p>概要: {formData.description}</p>
      <p>時給: {formData.wage}</p>
      <p>
        開催期間: {formData.startDate} ~ {formData.endDate}
      </p>

      <button onClick={handleSubmit}>投稿する</button>
      <button onClick={() => navigate(-1)}>戻る</button>
    </div>
  );
}
