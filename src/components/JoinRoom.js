import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const JoinRoom = ({ setRoomId }) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    try {
      const docRef = doc(db, 'rooms', roomIdInput);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRoomId(roomIdInput);
        setError('');
      } else {
        setError('Incorrect Room ID');
      }
    } catch (error) {
      console.error('Error checking room:', error);
      setError('Error joining room. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 mb-2 w-full"
        placeholder="Room ID"
        value={roomIdInput}
        onChange={(e) => setRoomIdInput(e.target.value)}
      />
      <button
        onClick={handleJoinRoom}
        className="bg-green-500 text-white p-2 w-full"
      >
        Join Room
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default JoinRoom;
