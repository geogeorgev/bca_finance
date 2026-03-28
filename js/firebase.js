// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxyPUoSUz-JgeU1T1KaS_usagIgUPAXYg",
  authDomain: "bcachurch-finance.firebaseapp.com",
  projectId: "bcachurch-finance",
  storageBucket: "bcachurch-finance.firebasestorage.app",
  messagingSenderId: "747522530973",
  appId: "1:747522530973:web:2296987d81e5563d087e74"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
// Firebase Storage requires Blaze plan - receipts stored in Firestore instead
