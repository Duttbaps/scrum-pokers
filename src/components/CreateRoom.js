import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../firebase'; // Firebase auth import

const CreateRoom = ({ setRoomId }) => {
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Assuming user details are stored in Firestore (users collection)
          setDisplayName(user.displayName || 'Unknown User'); // Use Firebase Auth displayName or fallback
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName) return;

    try {
      // Create the room document with owner information
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        ownerName: displayName, // Store the owner's display name
        // You can add other room data here if necessary
      });
      setRoomId(roomRef.id); // Pass the room ID to the parent component (App) for navigation
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="create-room">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Session Name</h2>
        <input
          type="text"
          placeholder="e.g., MIS"
          className="border rounded py-2 px-3 mb-2"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Display Name</h2>
        <input
          type="text"
          placeholder="Display Name"
          className="border rounded py-2 px-3 mb-2" // Make the input look disabled
          value={displayName}
          disabled // Disable the input field
        />
      </div>
      <button onClick={handleCreateRoom} className="button-23">
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
