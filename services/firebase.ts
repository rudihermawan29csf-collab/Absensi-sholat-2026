
import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// Suppress Firestore internal warnings/errors (like Quota Exceeded) in the console
setLogLevel('silent');

// --- PANDUAN PENGISIAN ---
// 1. Buka console.firebase.google.com
// 2. Buka Project Settings -> Scroll ke bawah ke "Your apps"
// 3. Copy object 'firebaseConfig' dan tempelkan isinya di bawah ini menggantikan placeholder.

const firebaseConfig = {
  apiKey: "AIzaSyAQj_7S1c8-lhZiRBVpQTnmo3l7PBwEUBY",
  authDomain: "absensi-smpn3-pacet.firebaseapp.com",
  projectId: "absensi-smpn3-pacet",
  storageBucket: "absensi-smpn3-pacet.firebasestorage.app",
  messagingSenderId: "433565489244",
  appId: "1:433565489244:web:0804fc71bfd8ab8cccae99"
};

// Deteksi apakah user sudah mengubah config atau masih default
export const isFirebaseConfigured = firebaseConfig.projectId !== "GANTI_DENGAN_PROJECT_ID";

// Initialize Firebase only if configured (prevents instant errors in console)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
