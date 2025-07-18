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

// Mock user data for testing
const MOCK_USERS = [
  {
    email: 'soy@freshtracker.com',
    password: 'SoySauce2024!',
    displayName: 'Soy Master',
    uid: 'mock-user-1'
  },
  {
    email: 'avocado@freshtracker.com',
    password: 'GuacamoleLover99!',
    displayName: 'Avocado Enthusiast',
    uid: 'mock-user-2'
  }
];

// Mock authentication state
let currentUser: User | null = null;
let authStateListeners: ((user: User | null) => void)[] = [];

// Create mock User object
const createMockUser = (userData: typeof MOCK_USERS[0]): User => ({
  uid: userData.uid,
  email: userData.email,
  displayName: userData.displayName,
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({
    authTime: new Date().toISOString(),
    claims: {},
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'password',
    signInSecondFactor: null,
    token: 'mock-id-token'
  } as any),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  photoURL: null,
  providerId: 'password'
});

// Mock Firebase configuration (not actually used in mock mode)
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id"
};

// Initialize Firebase (not actually used in mock mode)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Mock authentication functions
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
      const error = new Error('User already exists') as any;
      error.code = 'auth/email-already-in-use';
      return { user: null, error };
    }

    // Create new mock user
    const newUser = {
      email,
      password,
      displayName: displayName || 'New User',
      uid: `mock-user-${Date.now()}`
    };
    
    MOCK_USERS.push(newUser);
    const mockUser = createMockUser(newUser);
    currentUser = mockUser;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(mockUser));
    
    return { user: mockUser, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Find user in mock data
    const userData = MOCK_USERS.find(user => 
      user.email === email && user.password === password
    );
    
    if (!userData) {
      const error = new Error('Invalid credentials') as any;
      error.code = 'auth/user-not-found';
      return { user: null, error };
    }
    
    const mockUser = createMockUser(userData);
    currentUser = mockUser;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(mockUser));
    
    return { user: mockUser, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
};

export const signOutUser = async () => {
  try {
    currentUser = null;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(null));
    
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const resetPassword = async (email: string) => {
  try {
    // Check if user exists
    const userExists = MOCK_USERS.find(user => user.email === email);
    if (!userExists) {
      const error = new Error('User not found') as any;
      error.code = 'auth/user-not-found';
      return { error };
    }
    
    // In a real app, this would send an email
    console.log(`Mock password reset email sent to: ${email}`);
    
    return { error: null };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  authStateListeners.push(callback);
  
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

export { auth }; 