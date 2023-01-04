import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCrEcuTblvUie4YWToCmEVfG5RqnBbib6E",
    authDomain: "e-mart-b57d8.firebaseapp.com",
    projectId: "e-mart-b57d8",
    storageBucket: "e-mart-b57d8.appspot.com",
    messagingSenderId: "562403973767",
    appId: "1:562403973767:web:0b8028e4b0ebf6db76b622",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
