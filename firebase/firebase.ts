import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvNrQygTKtbE71NlzVrugURPmsmVCWEDk",
  authDomain: "diabetapp-b39e0.firebaseapp.com",
  projectId: "diabetapp-b39e0",
  storageBucket: "diabetapp-b39e0.appspot.com",
  messagingSenderId: "944537282741",
  appId: "1:944537282741:android:675980e45c8e375496b6fc",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };
