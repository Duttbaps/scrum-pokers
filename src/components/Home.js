import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

const Home = ({ setRoomId, setUserName }) => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const navigate = useNavigate();

  const handleSetRoomId = (id) => {
    setRoomId(id); // Set roomId in parent (App.js)
    navigate(`/${id}`); // Navigate to the created/joined room
  };

  return (

    <div className="flex h-screen">
    {/* Left Image */}
    <div className="w-1/2 flex items-center justify-center">
      <img
        src="https://planning-poker-agile.web.app/static/media/background.1d8f31777a7b7a758461.jpg"
        alt="Room"
        className="w-auto max-h-[80vh] object-contain" // Adjust the max height as needed
      />
    </div>
  
    {/* Right Side */}
    <div className="w-1/2 p-8">
      {/* Navigation buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('create')}
        >
          Create
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'join' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('join')}
        >
          Join
        </button>
      </div>
  
      {/* Conditional Rendering based on activeTab */}
      {activeTab === 'create' ? (
        <>
          <h1 className="sessionheading">Create New Session</h1>
          <CreateRoom setRoomId={handleSetRoomId} setUserName={setUserName} />
        </>
      ) : (
        <>
          <h1 className="sessionheading">Join a Session</h1>
          <JoinRoom setRoomId={handleSetRoomId} setUserName={setUserName} />
        </>
      )}
    </div>
  </div>
  
  
  );
};

export default Home;
