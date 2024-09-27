import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAiwO6ulM5yTUDLNZ-smfSSThATpQtVSoU",
    authDomain: "scrumpoker-2e13e.firebaseapp.com",
    projectId: "scrumpoker-2e13e",
    storageBucket: "scrumpoker-2e13e.appspot.com",
    messagingSenderId: "469274462818",
    appId: "1:469274462818:web:25a0b2c71f899b53725f3b",
    measurementId: "G-XRLX8HK1HW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile };