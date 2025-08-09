import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot // ← 追加
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase設定
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
  const nameList = document.getElementById("nameList");

  // 🔹 リアルタイムでリストを更新
  onSnapshot(collection(db, schoolName), (snapshot) => {
    nameList.innerHTML = "";
    snapshot.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = doc.id; // ドキュメントID（=名前）
      nameList.appendChild(li);
    });
  });

  // 作成ボタン
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    if (!name) return alert("名前を入力してください");

    if (/[\/\[\]\*\#\?]/.test(name)) {
      alert("名前に / [ ] * # ? は使えません");
      return;
    }

    await setDoc(doc(db, schoolName, name), {
      createdAt: new Date(),
      note: "初期ドキュメント"
    });
    alert(`${schoolName} に ${name} を追加しました！`);
  });

  // 削除ボタン
  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    if (!name) return alert("削除する名前を入力してください");

    await deleteDoc(doc(db, schoolName, name));
    alert(`${schoolName} の ${name} を削除しました！`);
  });
});
