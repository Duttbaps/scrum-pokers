import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
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
          const userDoc = await getDoc(doc(db, 'users', user.uid)); // Assuming you have user details in Firestore
          if (userDoc.exists()) {
            const { firstName, lastName } = userDoc.data();
            setDisplayName(`${firstName} ${lastName}`);
          }
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
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
      });
      setRoomId(roomRef.id); // Pass the room ID to App for navigation
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="1">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Session Name</h2>
        <input
          type="text"
          placeholder="i.e MIS"
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
          disabled // Disable the input
        />
      </div>
      <button onClick={handleCreateRoom} className="button-23">
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
