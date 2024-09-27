import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in the database
      const userDoc = doc(db, 'users', user.uid);
      const userData = {
        firstName: user.displayName ? user.displayName.split(' ')[0] : 'First',
        lastName: user.displayName ? user.displayName.split(' ')[1] : 'Last',
        email: user.email,
      };
      await setDoc(userDoc, userData, { merge: true }); // Use merge to avoid overwriting existing data

      setUser(user);
      navigate('/room'); // Navigate to room creation/join page
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login / Signup</h2>
        
        {/* Flex column for vertical alignment */}
        <div className="flex flex-col space-y-4"> {/* Space between buttons */}
          <button 
            onClick={handleGoogleSignIn} 
            className="button-23 w-full"
          >
            Sign In with Google
          </button>

          <button 
            onClick={handleGoogleSignIn} 
            className="button-23 w-full"
          >
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
