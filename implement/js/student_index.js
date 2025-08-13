import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc
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

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ログインボタン
document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("ログインエラー:", err);
    alert("ログインに失敗しました");
  }
});

// ログアウトボタン
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("ログアウトエラー:", err);
  }
});

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  const schoolIdContainer = document.getElementById("schoolIdContainer");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    userInfo.textContent = `${user.displayName} さんでログイン中`;
    schoolIdContainer.style.display = "block";
  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    userInfo.textContent = "ログインしていません";
    schoolIdContainer.style.display = "none";
  }
});

// 「次へ」ボタン
document.getElementById("goBtn").addEventListener("click", async () => {
  const inputId = document.getElementById("schoolIdInput").value.trim();
  if (!inputId) {
    alert("学校IDを入力してください");
    return;
  }

  try {
    // Firestore全コレクションから学校IDを探す
    // （本番では効率化のため別の方法推奨）
    const schoolList = ["SampleSchool", "TestSchool"]; // デモ用、動的取得なら別途API化
    let foundSchool = null;

    for (const schoolName of schoolList) {
      const initDocRef = doc(db, schoolName, "_init");
      const initSnap = await getDoc(initDocRef);
      if (initSnap.exists() && initSnap.data().schoolId === inputId) {
        foundSchool = schoolName;
        break;
      }
    }

    if (foundSchool) {
      window.location.href =
        `https://dondenden.github.io/kanadon-karuta/implement/student_main.html?school=${encodeURIComponent(foundSchool)}`;
    } else {
      alert("学校IDが見つかりません");
    }
  } catch (err) {
    console.error("学校ID検索エラー:", err);
    alert("検索中にエラーが発生しました");
  }
});