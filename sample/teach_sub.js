import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase設定（teach_index.jsと同じものを使ってください）
const firebaseConfig = {
  apiKey: "AIzaSyCNbHkPWSQArwCg2LvoqsdJ_8yHbbP6sPs",
  authDomain: "donsuke-karuta.firebaseapp.com",
  projectId: "donsuke-karuta",
  storageBucket: "donsuke-karuta.firebasestorage.app",
  messagingSenderId: "949515279352",
  appId: "1:949515279352:web:3a62ffbb7f56e36e52d40d",
  measurementId: "G-90L24BHDTJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// URLパラメータからschool名を取得
const urlParams = new URLSearchParams(window.location.search);
const schoolName = urlParams.get("school");

if (!schoolName) {
  alert("学校名がURLパラメータに指定されていません");
  throw new Error("学校名がURLパラメータに指定されていません");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();

    if (!name) {
      alert("名前を入力してください");
      return;
    }

    if (/[\/\[\]\*]/.test(name)) {
      alert("名前に / [ ] * は使えません");
      return;
    }

    try {
      // schoolsコレクション → schoolNameドキュメント → usersサブコレクション → nameドキュメント
      const userDocRef = doc(db, "schools", schoolName, "users", name);
      await setDoc(userDocRef, {
        createdAt: new Date(),
        note: "初期ドキュメント"
      });
      alert(`${schoolName} / ${name} を作成しました！`);
    } catch (e) {
      console.error("エラー:", e);
      alert("エラーが発生しました");
    }
  });
});
