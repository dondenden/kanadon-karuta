import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
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

  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();

    if (!name) {
      alert("削除したいコレクション名を入力してください");
      return;
    }

    if (!confirm(`${name} コレクションの全ドキュメントを削除します。本当によろしいですか？`)) {
      return;
    }

    try {
      const collRef = collection(db, name);
      const snapshot = await getDocs(collRef);

      if (snapshot.empty) {
        alert(`${name} コレクションにドキュメントがありません`);
        return;
      }

      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      alert(`${name} コレクション内のドキュメントをすべて削除しました`);
    } catch (e) {
      console.error("削除エラー:", e);
      alert("削除時にエラーが発生しました");
    }
  });
});
