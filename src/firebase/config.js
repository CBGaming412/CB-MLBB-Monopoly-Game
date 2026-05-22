// Firebase Configuration for MLBB Monopoly
// Configured for: mlbb-monopoly project

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAhNncAgD0HcrUwVzuy4C3PjeqVpW7T6rw",
  authDomain: "mlbb-monopoly.firebaseapp.com",
  databaseURL: "https://mlbb-monopoly-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mlbb-monopoly",
  storageBucket: "mlbb-monopoly.firebasestorage.app",
  messagingSenderId: "246782762782",
  appId: "1:246782762782:web:626e186a763b35c47d330f"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;
