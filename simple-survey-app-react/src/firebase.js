import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Add your firebase config here
  apiKey: "AIzaSyCcISjqHKzxR8whVyO7wgHaMLFbSFznQt0",
  authDomain: "simple-surveys-management.firebaseapp.com",
  projectId: "simple-surveys-management",
  storageBucket: "simple-surveys-management.appspot.com",
  messagingSenderId: "3592516027",
  appId: "1:3592516027:web:45179e0feacaa65d8f549e",
  measurementId: "G-0EMV8RXFCH"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// database
const db = firebaseApp.firestore();

// Auth
const auth = firebase.auth();

export { auth };
export default db;