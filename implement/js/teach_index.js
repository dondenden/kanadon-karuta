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

// Firestore禁止文字削除
const normalizeSchoolName = (name) => name.replace(/[\/.#$[\]]/g, "");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  const schoolInput = document.getElementById("school_name");
  const schoolIdContainer = document.getElementById("schoolIdContainer");
  const schoolIdInput = document.getElementById("school_id");
  const confirmBtn = document.getElementById("confirmBtn");
  const backBtn = document.getElementById("backBtn");

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
      schoolIdContainer.style.display = "none";
    }
  });

  // 学校名入力時
  schoolInput.addEventListener("change", async () => {
    const inputName = schoolInput.value.trim();
    if (!inputName) return;

    const schoolName = normalizeSchoolName(inputName);

    try {
      const schoolRef = collection(db, schoolName);
      const snapshot = await getDocs(schoolRef);

      schoolIdContainer.style.display = "block";
      schoolIdInput.disabled = false;

      if (snapshot.empty) {
        // 新規
        schoolIdInput.placeholder = "新規IDを入力";
        schoolIdInput.dataset.mode = "new";
      } else {
        // 既存
        schoolIdInput.placeholder = "学校IDを入力";
        schoolIdInput.dataset.mode = "existing";
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  });

  // 次へボタン
  confirmBtn.addEventListener("click", async () => {
    const schoolName = normalizeSchoolName(schoolInput.value.trim());
    const inputId = schoolIdInput.value.trim();
    const mode = schoolIdInput.dataset.mode;

    if (!inputId) {
      alert("学校IDを入力してください");
      return;
    }

    if (mode === "new") {
      // 新規作成
      await setDoc(doc(db, schoolName, "_init"), {
        createdAt: serverTimestamp(),
        schoolId: inputId
      });
      window.location.href =
        `teach_sub.html?school=${encodeURIComponent(schoolName)}`;

    } else if (mode === "existing") {
      // 既存 → IDチェック
      const initSnap = await getDocs(collection(db, schoolName));
      const initData = initSnap.docs.find(doc => doc.id === "_init")?.data();

      if (initData && initData.schoolId === inputId) {
        window.location.href =
          `teach_sub.html?school=${encodeURIComponent(schoolName)}`;
      } else {
        alert("学校IDが間違っています");
      }
    }
  });

  // 戻るボタン
  backBtn.addEventListener("click", () => {
    history.back();
  });
});