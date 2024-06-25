import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Home = ({ setRoomId }) => {
  const [roomName, setRoomName] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState('');

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 7); // Generate a 5-character random string
  };

  const handleCreateRoom = async () => {
    const roomId = generateRoomId();
    try {
      await setDoc(doc(db, 'rooms', roomId), {
        name: roomName,
        createdAt: serverTimestamp(),
      });
      setRoomId(roomId);
      setCreatedRoomId(roomId);
      setRoomCreated(true); // Set roomCreated to true immediately upon room creation
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const closeModal = () => {
    setRoomCreated(false);
    setRoomName('');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomName">
          Room Name
        </label>
        <input
          id="roomName"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Room
      </button>

      {/* Popup container */}
      {roomCreated && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white p-8 rounded shadow-lg z-50">
            <h2 className="text-lg font-bold mb-4">Room created successfully!</h2>
            <p className="mb-2"><strong>Room Name:</strong> {roomName}</p>
            <p className="mb-4"><strong>Room ID:</strong> {createdRoomId}</p>
            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
