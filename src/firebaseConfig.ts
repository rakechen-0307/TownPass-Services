// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNI3wyg_bfdfb8mH9qU8jHM-PSM822-Xw",
  authDomain: "codefest-test-0825.firebaseapp.com",
  databaseURL: "https://codefest-test-0825-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codefest-test-0825",
  storageBucket: "codefest-test-0825.appspot.com",
  messagingSenderId: "321492198045",
  appId: "1:321492198045:web:f168e8f83a84cf48b3ea74",
  measurementId: "G-JQVY7XTG5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app };