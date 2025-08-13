import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
const auth = getAuth(app);
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

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    userInfo.textContent = `${user.displayName} さんでログイン中`;
  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    userInfo.textContent = "ログインしていません";
  }
});