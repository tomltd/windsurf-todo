# Todo App with Firebase

## Description
A sleek, modern todo web application with cloud storage using Firebase. This app allows users to add, remove, and reorder tasks, with all changes persisting across devices and sessions.

## Features
- Add new tasks
- Mark tasks as completed
- Reorder tasks with up/down arrows
- Clear all completed tasks
- Data persistence with Firebase Firestore
- Responsive design for all device sizes

## Setup Instructions

### Firebase Setup
1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/)
2. Create a new Firebase project
3. Enable Firestore Database in your project
4. Register a new web app in your Firebase project
5. Copy your Firebase configuration (available in Project Settings > Your Apps)
6. Open `firebase-config.js` and replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Running the App
1. After setting up Firebase, you need to run the app using a local server (due to ES modules)
2. There are several options for running a local server:

   #### Option 1: Python Server (Recommended)
   ```
   python run_server.py
   ```
   Then open http://localhost:8000 in your browser

   #### Option 2: VS Code Live Server
   If you have VS Code, install the Live Server extension and click "Go Live"

   #### Option 3: Python Simple HTTP Server
   ```
   python -m http.server
   ```
   Then open http://localhost:8000 in your browser

   #### Option 4: Node.js Server
   If you have Node.js installed:
   ```
   npm install
   npm start
   ```
   Then open http://localhost:8080 in your browser

## Technologies Used
- HTML5
- CSS3 (with CSS variables)
- JavaScript (ES6+)
- Firebase Firestore
- Google Fonts (Inter)

## Project Structure
- `index.html` - Main HTML structure
- `styles.css` - All styling with CSS variables for theming
- `script.js` - Application logic and Firebase integration
- `firebase-config.js` - Firebase configuration and exports
- `run_server.py` - Python server for local development
- `server.js` - Node.js server for local development (requires Node.js)
- `firestore.rules` - Firebase security rules template

## Notes
- This app uses ES modules, so it must be served from a web server (not opened directly as a file)
- The Firebase configuration in `firebase-config.js` should be replaced with your own Firebase project details
- For production use, consider implementing user authentication and updating the Firestore security rules
