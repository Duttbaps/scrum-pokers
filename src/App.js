import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import CreateRoom from './components/CreateRoom';
import Login from './components/login';
import JoinRoom from './components/JoinRoom';
import Estimate from './components/Estimate';

// Home component handles room creation and joining
// eslint-disable-next-line
function Home({ setUser, user }) {
  // eslint-disable-next-line
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();

  const handleSetRoomId = (id) => {
    setRoomId(id);
    navigate(`/${id}`); // Navigate to the room page using its unique ID
  };

  return (
    <div className="container mx-auto p-4">
      <CreateRoom setRoomId={handleSetRoomId} />  {/* Create room flow */}
      <JoinRoom setRoomId={handleSetRoomId} />    {/* Join room flow */}
    </div>
  );
}

// Main App component for routing
function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Room create/join Route */}
        <Route path="/room" element={<Home user={user} setUser={setUser} />} />

        {/* Dynamic Route for each room */}
        <Route path="/:roomId" element={<Estimate user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
