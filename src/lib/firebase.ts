import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase設定
// 実際のプロジェクトでは、環境変数から取得することを推奨
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCUK0S1ACoHM6kBsS61CJMkNYS6R35yLi4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "jiro-tier.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "jiro-tier",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "jiro-tier.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "803003886029",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:803003886029:web:8ad88ae0f5a1bdf3e2bc84"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreデータベースを取得
export const db = getFirestore(app);

export default app;