import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDloI-TuWcF9wySKem9fVoLm03vVn5szxQ",
  authDomain: "projeto-taugor-andrespx.firebaseapp.com",
  projectId: "projeto-taugor-andrespx",
  storageBucket: "projeto-taugor-andrespx.firebasestorage.app",
  messagingSenderId: "276675273035",
  appId: "1:276675273035:web:d39967df4e7eb7015b48ce",
  measurementId: "G-7VJQT51H6C"
};

const app = initializeApp(firebaseConfig);

export default app;