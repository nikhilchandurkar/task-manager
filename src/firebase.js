import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"



const firebaseConfig = {
  apiKey: "AIzaSyD-cs6kYyeQIgu5VtaakDKiB8L2nMLDWZI",
  authDomain: "task-manager-114b8.firebaseapp.com",
  projectId: "task-manager-114b8",
  databseUrl:"https://console.firebase.google.com/u/0/project/task-manager-114b8/database/task-manager-114b8-default-rtdb/data/~2F",
  storageBucket: "task-manager-114b8.firebasestorage.app",
  messagingSenderId: "362128902207",
  appId: "1:362128902207:web:87d90b578bfc2280e6d08a",
  measurementId: "G-RHHX5PBSXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app





// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";  // Firestore
// import { getDatabase } from "firebase/database";  // Realtime Database
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD-cs6kYyeQIgu5VtaakDKiB8L2nMLDWZI",
//   authDomain: "task-manager-114b8.firebaseapp.com",
//   projectId: "task-manager-114b8",
//   databaseURL: "https://task-manager-114b8-default-rtdb.firebaseio.com",  // Corrected URL
//   storageBucket: "task-manager-114b8.appspot.com",
//   messagingSenderId: "362128902207",
//   appId: "1:362128902207:web:87d90b578bfc2280e6d08a",
//   measurementId: "G-RHHX5PBSXB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize services
// export const auth = getAuth(app);
// export const db = getDatabase(app); 
// export const firestore = getFirestore(app); // 
// export const storage = getStorage(app);

// export default app;
