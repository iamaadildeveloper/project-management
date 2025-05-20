import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRa6HlHJNX369XsmJpXSxX9pp6qojPcSA",
  authDomain: "project-management-82232.firebaseapp.com",
  projectId: "project-management-82232",
  storageBucket: "project-management-82232.appspot.com",
  messagingSenderId: "693853238361",
  appId: "1:693853238361:web:424899e44f73705aeaed48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };