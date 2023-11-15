// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwz9zH3ugu2DJ0iklSr5it0c5C_y4BWHI",
  authDomain: "next-social-app-a9933.firebaseapp.com",
  projectId: "next-social-app-a9933",
  storageBucket: "next-social-app-a9933.appspot.com",
  messagingSenderId: "681696658858",
  appId: "1:681696658858:web:9e0d9c7b05e4c026ae57d3",
  measurementId: "G-QDDCM8CZM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);