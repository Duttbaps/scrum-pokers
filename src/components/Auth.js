import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '../firebase';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        uid: result.user.uid,
        displayName: result.user.displayName,
      });
    } catch (err) {
      setError('Failed to sign in with Google');
    }
  };

  const handleEmailSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: `${firstName} ${lastName}` });
      setUser({
        uid: result.user.uid,
        displayName: `${firstName} ${lastName}`,
      });
    } catch (err) {
      setError('Failed to create account');
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        uid: result.user.uid,
        displayName: result.user.displayName,
      });
    } catch (err) {
      setError('Failed to sign in');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="border rounded py-2 px-3 mb-4 w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border rounded py-2 px-3 mb-4 w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border rounded py-2 px-3 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded py-2 px-3 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isSignUp ? (
          <button
            onClick={handleEmailSignUp}
            className="bg-blue-500 text-white p-2 w-full rounded mb-4"
          >
            Sign Up with Email
          </button>
        ) : (
          <button
            onClick={handleEmailSignIn}
            className="bg-blue-500 text-white p-2 w-full rounded mb-4"
          >
            Sign In with Email
          </button>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white p-2 w-full rounded mb-4"
        >
          Sign In with Google
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
