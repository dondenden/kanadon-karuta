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
  onAuthStateChanged,
  signOut
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
const auth = getAuth();

// URLパラメータから学校名取得
const urlParams = new URLSearchParams(window.location.search);
const schoolName = urlParams.get("school");

if (!schoolName) {
  alert("学校名がURLパラメータに指定されていません");
  throw new Error("学校名がURLパラメータに指定されていません");
}

// 学校IDを画面に表示
document.getElementById("schoolId").textContent = schoolName;

// 認証チェック
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    userInfo.textContent = `${user.displayName} さんでログイン中`;
    logoutBtn.style.display = "inline";
  } else {
    alert("ログインが必要です");
    window.location.href =
      "https://dondenden.github.io/kanadon-karuta/implement/teach_index.html";
  }
});

// ログアウト処理
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href =
    "https://dondenden.github.io/kanadon-karuta/implement/teach_index.html";
});

// 戻るボタン
document.getElementById("backBtn").addEventListener("click", () => {
  history.back();
});

// 名前一覧のリアルタイム取得
document.addEventListener("DOMContentLoaded", () => {
  const nameList = document.getElementById("nameList");

  onSnapshot(collection(db, schoolName), (snapshot) => {
    nameList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      if (docSnap.id.endsWith("_init")) return;

      const li = document.createElement("li");
      const nameSpan = document.createElement("span");
      nameSpan.textContent = docSnap.id;
      li.appendChild(nameSpan);

      // 削除ボタン
      const delBtn = document.createElement("button");
      delBtn.textContent = "削除";
      delBtn.style.marginLeft = "10px";
      delBtn.addEventListener("click", async () => {
        if (confirm(`「${docSnap.id}」を削除しますか？`)) {
          await deleteDoc(doc(db, schoolName, docSnap.id));
        }
      });
      li.appendChild(delBtn);

      nameList.appendChild(li);
    });
  });

  // 名前追加
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
  });
});