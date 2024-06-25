import React, { useState } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Estimate from './components/Estimate';

function App() {
  const [roomId, setRoomId] = useState(null);

  return (
    <div className="container mx-auto p-4">
      {!roomId ? (
        <>
          <CreateRoom setRoomId={setRoomId} />
          <JoinRoom setRoomId={setRoomId} />
        </>
      ) : (
        <Estimate roomId={roomId} />
      )}
    </div>
  );
}

export default App;
