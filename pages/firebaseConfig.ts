// pages/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQXdZat_ZhbPf1QRA114-XEFuDDp3hmiI",
  authDomain: "evos-93d2c.firebaseapp.com",
  projectId: "evos-93d2c",
  storageBucket: "evos-93d2c.appspot.com",
  messagingSenderId: "828167136907",
  appId: "1:828167136907:web:a62eb0a1fd79f6da26968e",
  measurementId: "G-SRFP5S2FFP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
