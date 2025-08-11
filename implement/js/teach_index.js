// Firebase SDKの読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase設定（自分の設定に置き換え）
const firebaseConfig = {
  apiKey: "AIzaSyCNbHkPWSQArwCg2LvoqsdJ_8yHbbP6sPs",
  authDomain: "donsuke-karuta.firebaseapp.com",
  projectId: "donsuke-karuta",
  storageBucket: "donsuke-karuta.firebasestorage.app",
  messagingSenderId: "949515279352",
  appId: "1:949515279352:web:3a62ffbb7f56e36e52d40d",
  measurementId: "G-90L24BHDTJ"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 学校名を正規化（英数字・アンダースコア・ハイフン以外は置換）
const normalizeSchoolName = (name) => name.replace(/[^a-zA-Z0-9_-]/g, "_");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("school_name").addEventListener("change", async () => {
    const inputName = document.getElementById("school_name").value.trim();
    if (!inputName) {
      alert("学校名を入力してください");
      return;
    }
    const schoolName = normalizeSchoolName(inputName);

    try {
      // 学校コレクションの存在確認
      const schoolRef = collection(db, schoolName);
      const snapshot = await getDocs(schoolRef);

      if (snapshot.empty) {
        // コレクションが空 → 新規作成（ダミードキュメント追加）
        await setDoc(doc(db, schoolName, "_init"), { createdAt: serverTimestamp() });
        console.log("新しい学校コレクションを作成しました");
      } else {
        console.log("既存の学校コレクションが見つかりました");
      }

      // teach_sub.html に遷移
      window.location.href = `https://dondenden.github.io/kanadon-karuta/implement/teach_sub.html?school=${encodeURIComponent(schoolName)}`;

    } catch (error) {
      console.error("エラー:", error);
      alert("データベース処理中にエラーが発生しました");
    }
  });
});
