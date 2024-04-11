// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "primebazaar-ecommerce.firebaseapp.com",
  projectId: "primebazaar-ecommerce",
  storageBucket: "primebazaar-ecommerce.appspot.com",
  messagingSenderId: "1028630181729",
  appId: "1:1028630181729:web:12f22b987c1be4f28fb720",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
