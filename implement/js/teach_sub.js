import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 認証保護（未ログインなら teach_index.html に戻す）
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("このページを見るにはログインが必要です");
    window.location.href = "teach_index.html";
  }
});

// URLパラメータから学校名取得
const urlParams = new URLSearchParams(window.location.search);
const schoolName = urlParams.get("school");
if (!schoolName) {
  alert("学校名がURLパラメータに指定されていません");
  throw new Error("学校名がURLパラメータに指定されていません");
}

document.addEventListener("DOMContentLoaded", () => {
  const nameList = document.getElementById("nameList");

  // 🔹 リアルタイム更新
  onSnapshot(collection(db, schoolName), (snapshot) => {
    nameList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      if (docSnap.id.endsWith("_init")) return; // _initは表示しない

      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = docSnap.id;
      li.appendChild(nameSpan);

      const delBtn = document.createElement("button");
      delBtn.textContent = "削除";
      delBtn.style.marginLeft = "10px";
      delBtn.addEventListener("click", async () => {
        if (confirm(`「${docSnap.id}」を削除しますか？`)) {
          await deleteDoc(doc(db, schoolName, docSnap.id));
          console.log(`${docSnap.id} を削除しました`);
        }
      });
      li.appendChild(delBtn);

      nameList.appendChild(li);
    });
  });

  // 🔹 作成ボタン
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    if (!name) return alert("名前を入力してください");

    if (/[\/\[\]\*\#\?]/.test(name)) {
      alert("名前に / [ ] * # ? は使えません");
      return;
    }

    await setDoc(doc(db, schoolName, name), {
      createdAt: serverTimestamp(),
      note: "初期ドキュメント"
    });
    document.getElementById("name").value = "";
    console.log(`${schoolName} に ${name} を追加しました！`);
  });

  // 🔹 前のページに戻る
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href =`https://dondenden.github.io/kanadon-karuta/implement/teach_index`;
  });
});