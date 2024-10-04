import React, { useState } from 'react';

const JoinRoom = ({ setRoomId }) => {
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleJoinRoom = () => {
    if (joinRoomId) {
      setRoomId(joinRoomId); // Set the room ID and navigate to that room
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Join Session</h2>
      <input
        type="text"
        placeholder="Session ID"
        className="border rounded py-2 px-3 mb-2"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom} className="button-23">
        Join Session
      </button>
    </div>
  );
};

export default JoinRoom;
