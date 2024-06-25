import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Home = ({ setRoomId }) => {
  const [roomName, setRoomName] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState('');

  const handleCreateRoom = async () => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        createdAt: serverTimestamp(),
      });
      setRoomId(docRef.id);
      setCreatedRoomId(docRef.id);
      setRoomCreated(true);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="p-4">
      {!roomCreated ? (
        <>
          <input
            type="text"
            className="border p-2 mb-2 w-full"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white p-2 w-full"
          >
            Create Room
          </button>
        </>
      ) : (
        <div className="p-4 bg-green-100 border border-green-500">
          <p>Room created successfully!</p>
          <p><strong>Room Name:</strong> {roomName}</p>
          <p><strong>Room ID:</strong> {createdRoomId}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
