import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode.react'; // Import QRCode component
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import CopyToClipboard component

const Estimate = ({ roomId }) => {
  const [estimate, setEstimate] = useState('');
  const [estimates, setEstimates] = useState([]);
  const [error, setError] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [copied, setCopied] = useState(false); // State to track if room ID is copied

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const docRef = doc(db, 'rooms', roomId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRoomDetails(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleEstimate = async () => {
    try {
      await addDoc(collection(db, 'rooms', roomId, 'estimates'), {
        estimate: parseInt(estimate),
      });
      setEstimate('');
    } catch (error) {
      setError('Failed to submit estimate');
    }
  };

  const handleCopyRoomId = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
  };

  const renderPopup = () => {
    if (!roomDetails) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
        <div className="bg-white p-8 rounded shadow-lg z-50 max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Room Details</h2>
          <p className="mb-2"><strong>Room Name:</strong> {roomDetails.name}</p>
          <p className="mb-4"><strong>Room ID:</strong> {roomId}</p>

          {/* Copy room ID functionality */}
          <div className="flex items-center mb-4">
            <CopyToClipboard text={roomId} onCopy={handleCopyRoomId}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline">
                Copy Room ID
              </button>
            </CopyToClipboard>
            {copied && <span className="text-green-500 ml-2">Copied!</span>}
          </div>

          {/* QR Code */}
          <div className="mb-4">
            <QRCode value={roomId} size={128} />
          </div>

          <button
            onClick={() => setRoomDetails(null)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <input
        type="number"
        className="border p-2 mb-2 w-full"
        placeholder="Estimate (hours)"
        value={estimate}
        onChange={(e) => setEstimate(e.target.value)}
      />
      <button
        onClick={handleEstimate}
        className="bg-yellow-500 text-white p-2 w-full"
      >
        Submit Estimate
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4">
        <h3 className="text-xl mb-2">Estimates</h3>
        <ul>
          {estimates.map((est, index) => (
            <li key={index} className="border p-2 mb-1">{est.estimate} hours</li>
          ))}
        </ul>
      </div>
      {roomDetails && renderPopup()}
    </div>
  );
};

export default Estimate;
