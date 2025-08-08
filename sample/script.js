import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase設定（あなたの設定に置き換えてください）
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
    const docRef = doc(db, name, "initDoc");
    await setDoc(docRef, {
      createdAt: new Date(),
      note: "初期ドキュメント"
    });
    alert(`${name} コレクションを作成しました！`);
  } catch (e) {
    console.error("エラー:", e);
    alert("エラーが発生しました");
  }
});
