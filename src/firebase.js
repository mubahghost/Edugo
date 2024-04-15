import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBfRUvJMeNudpR8oLkHwF07qQOWVdeEKHU",
    authDomain: "edugo-25267.firebaseapp.com",
    projectId: "edugo-25267",
    storageBucket: "edugo-25267.appspot.com",
    messagingSenderId: "707187391747",
    appId: "1:707187391747:web:c910dcafa714b5d1a7bd36",
    measurementId: "G-WTWLJ6KZ21"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = firestore; // Set db to firestore instance

export { firestore, storage, auth, app, db };