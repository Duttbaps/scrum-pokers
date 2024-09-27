import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateRoom = ({ setRoomId }) => {
  const [roomName, setRoomName] = useState('');

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
    <div className="mb-4">
      <h2 className="text-xl font-bold">Create a Room</h2>
      <input
        type="text"
        placeholder="Enter room name"
        className="border rounded py-2 px-3 mb-2"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom} className="button-23">
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
