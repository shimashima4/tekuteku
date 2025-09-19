import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

/**
 * 受け取った値を "YYYY-MM-DD" 文字列に変換して返す。
 * - Firebase Timestamp (toDateあり) / Date / すでに文字列 のいずれも扱える。
 * - 値がなければ null を返す。
 */
function toDateString(val) {
  if (!val && val !== 0) return null;
  // Firebase Timestamp?
  if (val && typeof val.toDate === "function") {
    const d = val.toDate();
    return d.toISOString().slice(0, 10);
  }
  // JS Date
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  // すでに "YYYY-MM-DD" の文字列の可能性
  if (typeof val === "string") {
    // 簡易バリデート（YYYY- で始まればそのまま返す）
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // ISO-like 文字列なら日付部だけ切り出す
    const d = new Date(val);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  }
  return null;
}

export default function JobBoard() {
  const [posts, setPosts] = useState([]);

  // 投稿フォーム入力値
  const [formData, setFormData] = useState({
    title: "",
    keyword: "",
    description: "",
    wage: "",
    startDate: "",
    endDate: "",
  });

  // 検索条件
  const [filters, setFilters] = useState({
    keyword: "",
    minWage: "",
    date: "",
  });

  // Firestore から取得して正規化して state にセット
  const fetchPosts = async () => {
    try {
      const snap = await getDocs(collection(db, "jobs"));
      const data = snap.docs.map((doc) => {
        const d = doc.data() || {};
        const startDate = toDateString(d.startDate ?? d.eventStart);
        const endDate = toDateString(d.endDate ?? d.eventEnd);
        return {
          id: doc.id,
          title: d.title ?? "",
          description: d.description ?? "",
          keyword: d.keyword ?? "",
          // wage が string で保存されている可能性を考慮して数値化
          wage: d.wage !== undefined && d.wage !== null ? Number(d.wage) : 0,
          startDate,
          endDate,
          createdAt:
            d.createdAt && typeof d.createdAt.toDate === "function"
              ? d.createdAt.toDate()
              : d.createdAt ?? null,
        };
      });
      setPosts(data);
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    // リアルタイムが必要なら onSnapshot に置き換え
  }, []);

  // フォーム入力処理
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 投稿処理（Firestore に追加）
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title ?? "",
        description: formData.description ?? "",
        keyword: formData.keyword ?? "",
        wage: formData.wage ? Number(formData.wage) : 0,
        // date inputs are strings like "2025-09-20"
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "jobs"), payload);
      alert("投稿が完了しました！");
      setFormData({
        title: "",
        keyword: "",
        description: "",
        wage: "",
        startDate: "",
        endDate: "",
      });
      fetchPosts(); // 投稿後に再取得して一覧を更新
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました。コンソールを確認してください。");
    }
  };

  // フィルター入力処理
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // フィルターリセット
  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      minWage: "",
      date: "",
    });
  };

  // フィルター適用（安全に .includes を使えるようにする）
  const filteredPosts = posts.filter((post) => {
    // 1) キーワード検索（title, description, keyword をまとめて検索）
    if (filters.keyword && filters.keyword.trim() !== "") {
      const needle = filters.keyword.trim().toLowerCase();
      const haystack = [
        post.keyword ?? "",
        post.title ?? "",
        post.description ?? "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(needle)) return false;
    }

    // 2) 最低時給フィルター
    if (filters.minWage && filters.minWage !== "") {
      const minWageNum = Number(filters.minWage);
      if (isNaN(minWageNum)) return false;
      if (Number(post.wage) < minWageNum) return false;
    }

    // 3) 日付（入力した日付が投稿の開催期間に含まれるか）
    if (filters.date && filters.date !== "") {
      const inputDate = new Date(filters.date + "T12:00:00"); // 安全に真ん中の時間を渡す
      const start = post.startDate
        ? new Date(post.startDate + "T00:00:00")
        : null;
      const end = post.endDate ? new Date(post.endDate + "T23:59:59") : null;

      // start / end が無ければその投稿は期間判定できないので除外（仕様により変えられます）
      if (!start || !end) return false;

      if (inputDate < start || inputDate > end) return false;
    }

    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>新規投稿</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="タイトル"
          value={formData.title}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="keyword"
          placeholder="キーワード"
          value={formData.keyword}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="description"
          placeholder="概要"
          value={formData.description}
          onChange={handleFormChange}
        />
        <input
          type="number"
          name="wage"
          placeholder="時給"
          value={formData.wage}
          onChange={handleFormChange}
          required
        />
        <label>
          開催開始日:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleFormChange}
            required
          />
        </label>
        <label>
          開催終了日:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleFormChange}
            required
          />
        </label>
        <button type="submit">投稿</button>
      </form>

      <h2>検索フィルター</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="keyword"
          placeholder="キーワード"
          value={filters.keyword}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minWage"
          placeholder="最低時給"
          value={filters.minWage}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <button type="button" onClick={handleResetFilters}>
          リセット
        </button>
      </div>

      <h2>投稿一覧</h2>
      {filteredPosts.length > 0 ? (
        <ul>
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong> / {post.keyword} / 時給: {post.wage}
              円 / 開催: {post.startDate ?? "未設定"} ~{" "}
              {post.endDate ?? "未設定"}
            </li>
          ))}
        </ul>
      ) : (
        <p>条件に合う投稿がありません</p>
      )}
    </div>
  );
}
