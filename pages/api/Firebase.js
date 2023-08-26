import { getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "next-ecommerce-394710.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_NAME,
  storageBucket: "mern-ecommerce-567c7.appspot.com",
  messagingSenderId: "316960201807",
  appId: "1:316960201807:web:73a405301861ac3fda1e3a",
  measurementId: "G-YFRDJ0YN7V"
};
// Initialize Firebase
let app;
try{
  app = initializeApp(firebaseConfig);
}catch(err){
  app = getApp()
}

export const storage = getStorage(app);
