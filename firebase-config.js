// Firebase configuration
// Replace these values with your actual Firebase project configuration

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlpTi5HTBrtejWOy3mucSuJ6kX9170E_A",
  authDomain: "windsurf-todo.firebaseapp.com",
  projectId: "windsurf-todo",
  storageBucket: "windsurf-todo.firebasestorage.app",
  messagingSenderId: "477111723364",
  appId: "1:477111723364:web:ee80fcfc748921d9fc8671",
  measurementId: "G-VE5MZGWNCZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Export the Firestore database and methods
export { db };