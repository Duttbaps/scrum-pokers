// JoinRoom.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase imports
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports

const JoinRoom = ({ setRoomId }) => {
  const [joinRoomId, setJoinRoomId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [roomExists, setRoomExists] = useState(true); // New state for room existence

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid)); // Assuming user details are stored in Firestore
          if (userDoc.exists()) {
            const { firstName, lastName } = userDoc.data();
            setDisplayName(`${firstName} ${lastName}`); // Set the display name from firstName and lastName
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleJoinRoom = async () => {
    if (joinRoomId) {
      const roomDoc = await getDoc(doc(db, 'rooms', joinRoomId)); // Check if the room exists
      if (roomDoc.exists()) {
        setRoomId(joinRoomId); // Set the room ID and navigate to that room
        setRoomExists(true); // Set room existence to true
      } else {
        setRoomExists(false); // Set room existence to false
      }
    }
  };

  return (
    <div>
      <div className='mb-2'>
        <h2 className="text-xl font-bold">Join Session</h2>
        <input
          type="text"
          placeholder="Session ID"
          className="border rounded py-2 px-3 mb-2"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
      </div>
      
      <div className='mb-2'>
        <h2 className="text-xl font-bold">Display Name</h2>
        <input
          type="text"
          placeholder="Display Name"
          className="border rounded py-2 px-3 mb-2 bg-gray-100" // Visually indicate that it's disabled
          value={displayName} // Set value to the fetched display name
          disabled // Disable the input
        />
      </div>

      <button onClick={handleJoinRoom} className="button-23">
        Join Session
      </button>
      
      {/* Feedback message for room existence */}
      {!roomExists && (
        <p className="text-red-500 mt-2">Room does not exist. Please enter a valid Session ID.</p>
      )}
    </div>
  );
};

export default JoinRoom;
