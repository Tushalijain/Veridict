import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBB93znonR_pV_jSXNYO790hiS0_4ydd8c",
  authDomain: "veridict-dcc46.firebaseapp.com",
  projectId: "veridict-dcc46",
  storageBucket: "veridict-dcc46.firebasestorage.app",
  messagingSenderId: "302629386903",
  appId: "1:302629386903:web:3ad39a06dac4d7338947d2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();