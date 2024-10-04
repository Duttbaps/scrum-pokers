import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login';
import Estimate from './components/Estimate';

function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(''); // Track custom user name
  const [roomId, setRoomId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/room" element={<Home setRoomId={setRoomId} setUserName={setUserName} />} />
        <Route path="/:roomId" element={<Estimate user={user} userName={userName} />} />
      </Routes>
    </Router>
  );
}

export default App;
