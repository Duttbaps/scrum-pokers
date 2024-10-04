import React, { useEffect } from 'react';
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

      // Check if there's a room ID in local storage
      const roomId = localStorage.getItem('roomId');
      if (roomId) {
        navigate(`/${roomId}`); // Navigate to the room if available
        localStorage.removeItem('roomId'); // Clear the stored room ID
      } else {
        navigate('/room'); // Navigate to room creation/join page
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  useEffect(() => {
    const roomId = new URLSearchParams(window.location.search).get('roomId');
    if (roomId) {
      localStorage.setItem('roomId', roomId);
    }
  }, []);

  return (
    <div className="centered-container">
      <div className="form-container">
        <h2 className="mb-6 text-2xl text-gray-700">Login/Signup</h2>
        <div className="flex flex-col space-y-4">
          <button onClick={handleGoogleSignIn} className="button-23 w-full">
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
