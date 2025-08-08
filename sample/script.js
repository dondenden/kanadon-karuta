import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// フォーム送信処理
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "messages"), {
      name: name,
      message: message,
      timestamp: new Date()
    });
    alert("保存しました！");
  } catch (e) {
    console.error("保存エラー: ", e);
  }
});