import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
  AuthError
} from 'firebase/auth';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication functions
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
};

export const signOutUser = async () => {
  try {
    
    await signOut(auth);
    
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const resetPassword = async (email: string) => {
  try {
    
    await sendPasswordResetEmail(auth, email);
    
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth }; 