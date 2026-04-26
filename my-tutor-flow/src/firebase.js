import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDgz0ppq63p-XFhgman1gLgw6YuOou_I9Q",
  authDomain: "my-tutor-flow-commercial.firebaseapp.com",
  projectId: "my-tutor-flow-commercial",
  storageBucket: "my-tutor-flow-commercial.firebasestorage.app",
  messagingSenderId: "485791221111",
  appId: "1:485791221111:web:109f372fc38833835fcd72",
  measurementId: "G-4EXS7QJ95C"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
