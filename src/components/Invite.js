import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path based on your project structure


const Invite = ({ setUserName }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  // Check if the name is already saved in local storage
  useEffect(() => {
    const savedName = localStorage.getItem('displayName');
    if (savedName) {
      setDisplayName(savedName);
      setUserName(savedName);
      if (!window.location.pathname.includes(roomId)) {
        navigate(`/${roomId}`, { state: { displayName: savedName } });
      }
    }
  }, [roomId, navigate, setUserName]);
  

  const handleEnterRoom = async () => {
    if (displayName.trim()) {
      try {
        // Save the display name to Firebase
        await addDoc(collection(db, 'rooms', roomId, 'participants'), {
          submittedBy: displayName,
          joinedAt: new Date().toISOString(),
        });
  
        // Save the display name locally
        setUserName(displayName);
        localStorage.setItem('displayName', displayName);
  
        // Navigate to the room and pass the displayName in state
        navigate(`/${roomId}`, { state: { displayName } }); // Pass name here
      } catch (err) {
        setError('Failed to join the room. Please try again.');
        console.error('Error adding document: ', err);
      }
    } else {
      setError('Please enter your name to join the room.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">You're Invited!</h2>
        <p className="mb-4">You are invited to join room {roomId}. Please enter your name to proceed.</p>
        <input
          type="text"
          placeholder="Enter your name"
          className="border rounded py-2 px-3 mb-2 w-full"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button 
          onClick={handleEnterRoom} 
          className="button-23"
        >
          Enter Room
        </button>
      </div>
    </div>
  );
};

export default Invite;
