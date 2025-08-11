// Firebase SDKの読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// 学校名を正規化（Firestore禁止文字だけ削除）
const normalizeSchoolName = (name) => name.replace(/[\/.#$[\]]/g, "");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  const schoolInput = document.getElementById("school_name");

  // ログイン
  loginBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("ログインに失敗しました");
    }
  });

  // ログアウト
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });

  // ログイン状態の監視
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userInfo.textContent = `${user.displayName} さんでログイン中`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline";
      schoolInput.disabled = false;
    } else {
      userInfo.textContent = "ログインしていません";
      loginBtn.style.display = "inline";
      logoutBtn.style.display = "none";
      schoolInput.disabled = true;
    }
  });

  // 学校名入力時
  schoolInput.addEventListener("change", async () => {
    const inputName = schoolInput.value.trim();
    if (!inputName) {
      alert("学校名を入力してください");
      return;
    }
    const schoolName = normalizeSchoolName(inputName);

    if (!schoolName) {
      alert("有効な学校名を入力してください");
      return;
    }

    try {
      // 学校コレクションの存在確認
      const schoolRef = collection(db, schoolName);
      const snapshot = await getDocs(schoolRef);

      if (snapshot.empty) {
        await setDoc(doc(db, schoolName, "_init"), { createdAt: serverTimestamp() });
        console.log("新しい学校コレクションを作成しました");
      } else {
        console.log("既存の学校コレクションが見つかりました");
      }

      // teach_sub.html に遷移
      window.location.href =
        `https://dondenden.github.io/kanadon-karuta/implement/teach_sub.html?school=${encodeURIComponent(schoolName)}`;

    } catch (error) {
      console.error("エラー:", error);
      alert("データベース処理中にエラーが発生しました");
    }
  });
});