// Test script to verify Firebase connection

// Firebase configuration
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
const db = firebase.firestore();

// Test function to add a document
async function testAddDocument() {
  try {
    const docRef = await db.collection('test').add({
      message: 'Hello from test script',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
}

// Test function to read a document
async function testReadDocument(docId) {
  try {
    const docRef = db.collection('test').doc(docId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error getting document: ', error);
  }
}

// Test function to delete a document
async function testDeleteDocument(docId) {
  try {
    await db.collection('test').doc(docId).delete();
    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error removing document: ', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting Firebase tests...');
  
  try {
    // Test adding a document
    const docId = await testAddDocument();
    
    // Test reading the document
    await testReadDocument(docId);
    
    // Test deleting the document
    await testDeleteDocument(docId);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}

// Execute tests when the page loads
document.addEventListener('DOMContentLoaded', runTests);
