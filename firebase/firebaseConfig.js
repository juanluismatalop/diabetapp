import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqBXvjpiFBVm2RpnM3hVhBYEaf3UkkliE",
  authDomain: "diabetapp-b39e0.firebaseapp.com",  
  projectId: "diabetapp-b39e0",
  storageBucket: "diabetapp-b39e0.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "XXXXXXXXXXXX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
