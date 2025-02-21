import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Remove analytics for server-side compatibility
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCzBaG5mVveb88l-s23BTbV5U6yarLNq0U",
  authDomain: "blink-2558b.firebaseapp.com",
  projectId: "blink-2558b",
  storageBucket: "blink-2558b.firebasestorage.app",
  messagingSenderId: "973320323451",
  appId: "1:973320323451:web:9d4475e646531dba6f3dde",
  measurementId: "G-GXQY0FPX37"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Remove analytics initialization as it requires browser environment
// const analytics = getAnalytics(app); 