// Firebase SDKの読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// 入力イベント
document.getElementById("school_name").addEventListener("change", async () => {
  const schoolName = document.getElementById("school_name").value.trim();
  if (!schoolName) {
    alert("学校名を入力してください");
    return;
  }

  try {
    // 学校コレクションの存在確認
    const schoolRef = collection(db, schoolName);
    const snapshot = await getDocs(schoolRef);

    if (snapshot.empty) {
      // コレクションが空 → 新規作成（ダミードキュメント追加）
      await setDoc(doc(db, schoolName, "_init"), { createdAt: new Date() });
      console.log("新しい学校コレクションを作成しました");
    } else {
      console.log("既存の学校コレクションが見つかりました");
    }

    // teach.html に遷移
    window.location.href = "teach.html";

  } catch (error) {
    console.error("エラー:", error);
    alert("データベース処理中にエラーが発生しました");
  }
});
