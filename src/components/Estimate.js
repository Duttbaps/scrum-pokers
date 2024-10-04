import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { differenceInDays, differenceInHours } from 'date-fns';

const Estimate = ({ user }) => {
  const { roomId } = useParams(); // Get the roomId from URL
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [error, setError] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [customURL, setCustomURL] = useState('');
  const [showURLContainer, setShowURLContainer] = useState(true); // Show URL container by default
  const [showEstimates, setShowEstimates] = useState(false); // State for estimates visibility

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
    setCustomURL(`${window.location.origin}/${roomId}`); // Generate the full room URL
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
      // Get user details
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const { firstName, lastName } = userDoc.data();
      const userName = `${firstName} ${lastName}`;

      // Add estimate with user name
      await addDoc(collection(db, 'rooms', roomId, 'estimates'), {
        estimate: totalHours,
        submittedBy: userName, // Include submitted by information
      });
      setStartDate(null);
      setEndDate(null);
      setError('');
    } catch (error) {
      setError('Please Signin for Submitting Estimates');
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
            <div className="back bg-white p-4 rounded-lg flex justify-center items-center flex-col">
              <span className="text-lg font-bold">{est.estimate} hours</span>
              <span className="text-sm text-gray-500">Submitted by: {est.submittedBy}</span> {/* Show submitted by */}
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
          className="button-23"
        >
          Submit Estimate
        </button>
        {error && <p className="text-red-500">{error}</p>}

        {/* Button to toggle estimates */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleShowEstimates}
            className="button-23"
          >
            {showEstimates ? 'Hide Estimates' : 'Show Estimates'}
          </button>
        </div>
        {showEstimates && renderEstimatesCards()}
      </div>

      {/* URL Container */}
      {showURLContainer && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
            {/* Close button (X) */}
            <button
              onClick={() => setShowURLContainer(false)}
              className="absolute top-2 right-2 text-red-500 text-lg"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Room Details</h2>
            <p className="mb-2">
              <strong>Room Name:</strong> {roomDetails?.name}
            </p>
            <p className="mb-4">
              <strong>Session ID:</strong> {roomId}
            </p>
            <div className="flex items-center mb-4">
              <CopyToClipboard text={customURL} onCopy={handleCopyRoomId}>
                <button className="button-23">
                  Copy Room URL
                </button>
              </CopyToClipboard>
              {copied && <span className="text-green-500 ml-2">Copied!</span>}
            </div>
            <div className="mb-4">
              <QRCode value={customURL} size={128} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estimate;
