import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { differenceInDays, differenceInHours } from 'date-fns';

const Estimate = ({ roomId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [error, setError] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showEstimates, setShowEstimates] = useState(false);

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

  useEffect(() => {
    const q = query(collection(db, 'rooms', roomId, 'estimates'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const estimatesList = [];
      querySnapshot.forEach((doc) => {
        estimatesList.push(doc.data());
      });
      setEstimates(estimatesList);
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleEstimate = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const days = differenceInDays(new Date(endDate), new Date(startDate));
    const hours = differenceInHours(new Date(endDate), new Date(startDate)) % 24;
    const totalHours = days * 24 + hours;

    try {
      await addDoc(collection(db, 'rooms', roomId, 'estimates'), {
        estimate: totalHours,
      });
      setStartDate(null);
      setEndDate(null);
      setError('');
    } catch (error) {
      setError('Failed to submit estimate');
    }
  };

  const handleCopyRoomId = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleShowEstimates = () => {
    setShowEstimates(!showEstimates);
  };

  const renderEstimatesCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {estimates.map((est, index) => (
          <div key={index} className="card rounded-lg shadow-md border border-gray-200 relative">
            <div className="front bg-blue-500 text-white p-4 rounded-lg flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="back bg-white p-4 rounded-lg flex justify-center items-center">
              <span className="text-lg font-bold">{est.estimate} hours</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Estimate Hours</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end-date">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleEstimate}
          className="bg-yellow-500 text-white p-2 w-full rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Submit Estimate
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleShowEstimates}
            className="bg-blue-500 text-white p-2 rounded focus:outline-none focus:shadow-outline"
          >
            {showEstimates ? 'Hide Estimates' : 'Show Estimates'}
          </button>
        </div>
        {showEstimates && renderEstimatesCards()}
      </div>

      {roomDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Room Details</h2>
            <p className="mb-2">
              <strong>Room Name:</strong> {roomDetails.name}
            </p>
            <p className="mb-4">
              <strong>Room ID:</strong> {roomId}
            </p>
            <div className="flex items-center mb-4">
              <CopyToClipboard text={roomId} onCopy={handleCopyRoomId}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline">
                  Copy Room ID
                </button>
              </CopyToClipboard>
              {copied && <span className="text-green-500 ml-2">Copied!</span>}
            </div>
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
      )}
    </div>
  );
};

export default Estimate;
