import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs
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

// URLパラメータから学校名取得（コレクション名）
const urlParams = new URLSearchParams(window.location.search);
const schoolName = urlParams.get("school");

if (!schoolName) {
  alert("学校名がURLパラメータに指定されていません");
  throw new Error("学校名がURLパラメータに指定されていません");
}

// schoolIdを取得して表示
async function loadSchoolId() {
  try {
    const initDocRef = doc(db, schoolName, "_init");
    const initDocSnap = await getDoc(initDocRef);

    if (initDocSnap.exists()) {
      const data = initDocSnap.data();
      document.getElementById("schoolId").textContent = data.schoolId || "(未設定)";
    } else {
      document.getElementById("schoolId").textContent = "(未登録)";
    }
  } catch (err) {
    console.error("schoolId取得エラー:", err);
    document.getElementById("schoolId").textContent = "(取得失敗)";
  }
}

// 認証チェック
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    userInfo.textContent = `${user.displayName} さんでログイン中`;
    logoutBtn.style.display = "inline";
    loadSchoolId();
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

// 学校全削除ボタン（学校ID確認付き）
document.getElementById("deleteSchoolBtn").addEventListener("click", async () => {
  try {
    // Firestoreから学校ID取得
    const initDocRef = doc(db, schoolName, "_init");
    const initDocSnap = await getDoc(initDocRef);

    if (!initDocSnap.exists()) {
      alert("この学校は存在しません");
      return;
    }

    const data = initDocSnap.data();
    const correctSchoolId = data.schoolId;

    // 学校ID確認
    const enteredId = prompt(`削除確認のため、学校IDを入力してください（${schoolName}）:`);
    if (enteredId === null) return; // キャンセル

    if (enteredId !== correctSchoolId) {
      alert("学校IDが一致しません。削除できません。");
      return;
    }

    if (!confirm(`学校「${schoolName}」の全データを削除します。よろしいですか？`)) return;

    // コレクション内全削除
    const colRef = collection(db, schoolName);
    const snapshot = await getDocs(colRef);

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, schoolName, docSnap.id));
    }

    alert(`学校「${schoolName}」のデータを削除しました`);
    window.location.href =
      "https://dondenden.github.io/kanadon-karuta/implement/teach_index.html";
  } catch (err) {
    console.error("削除エラー:", err);
    alert("削除中にエラーが発生しました");
  }
});