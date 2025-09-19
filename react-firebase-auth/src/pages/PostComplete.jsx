import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostComplete() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>投稿完了！</h2>
      <button onClick={() => navigate("/")}>新規登録に戻る</button>
      <button onClick={() => navigate("/list")}>一覧へ</button>
    </div>
  );
}
