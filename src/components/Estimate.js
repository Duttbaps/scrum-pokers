import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation} from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, doc, getDoc, deleteDoc, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { differenceInDays, differenceInHours } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTrash, faLink, faEye } from '@fortawesome/free-solid-svg-icons';

import './Card.css';

const Estimate = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [error, setError] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [customURL, setCustomURL] = useState('');
  const [showURLContainer, setShowURLContainer] = useState(true);
  const { state } = useLocation(); // Access state passed from Invite
  const userName = state?.displayName || localStorage.getItem('displayName') || 'Unknown User'; // Retrieve name here

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/invite/${roomId}`); // Redirect to the invite page if not authenticated
    } else {
      setCustomURL(`${window.location.origin}/${roomId}`);
      fetchRoomDetails();
    }
    // eslint-disable-next-line 
  }, [user, roomId, navigate]);

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

  useEffect(() => {
    const q = query(collection(db, 'rooms', roomId, 'estimates'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const estimatesList = [];
      querySnapshot.forEach((doc) => {
        estimatesList.push(doc.data());
      });
      setEstimates(estimatesList);
      setFlipped(new Array(estimatesList.length).fill(false)); // Initialize flipped state
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
  
    const userNameToSubmit = user?.displayName || userName; // Fallback to userName from Invite.js if user.displayName is not available
    
    try {
      await addDoc(collection(db, 'rooms', roomId, 'estimates'), {
        estimate: totalHours,
        submittedBy: userNameToSubmit, // Use userNameToSubmit here
      });
  
      setStartDate(null);
      setEndDate(null);
      setError('');
    } catch (error) {
      setError('An error occurred while submitting the estimate.');
      console.error('Error submitting estimate:', error);
    }
  };
  
  
  

  const handleCopyRoomId = () => {
    setCopied(true);
    setAlertMessage('Link copied successfully!');
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleFlip = () => {
    setFlipped(flipped.map(() => true)); // Flip all cards
  };

  const handleRestart = async () => {
    try {
      const estimatesQuery = query(collection(db, 'rooms', roomId, 'estimates'));
      const estimatesSnapshot = await getDocs(estimatesQuery);
      const deletePromises = estimatesSnapshot.docs.map((estimateDoc) =>
        deleteDoc(estimateDoc.ref)
      );
      await Promise.all(deletePromises);
      console.log('All estimates have been deleted.');
    } catch (error) {
      console.error('Error deleting estimates:', error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const estimatesQuery = query(collection(db, 'rooms', roomId, 'estimates'));
      const estimatesSnapshot = await getDocs(estimatesQuery);
      const deleteEstimatePromises = estimatesSnapshot.docs.map((estimateDoc) =>
        deleteDoc(estimateDoc.ref)
      );
      await Promise.all(deleteEstimatePromises);

      await deleteDoc(doc(db, 'rooms', roomId));
      console.log('Room and all estimates deleted.');
      navigate('/'); // Redirect after deleting
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const renderEstimatesCards = () => {
    return (
      <div className="cards-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {estimates.map((est, index) => (
          <div key={index} className="flip-card">
            <div className={`flip-card-inner ${flipped[index] ? 'is-flipped' : ''}`}>
              <div className="flip-card-front">
                <p className="title">FLIP CARD</p>
                <p>Waiting to Reveal</p>
              </div>
              <div className="flip-card-back">
                <p className="title">{est.estimate} hours</p>
                <p>Submitted by: {est.submittedBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      {/* Cards Container */}
      <div className="cards-section max-w-5xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Estimate Hours</h2>
        {renderEstimatesCards()}
      </div>

      {/* Buttons Section */}
      <div className="buttons-section max-w-5xl w-full p-6 bg-white shadow-md rounded-lg mt-6">
        <div className="flex justify-center space-x-6">
          <button onClick={handleFlip} className="flex flex-col items-center">
            <FontAwesomeIcon icon={faEye} size="2x" className="text-blue-500" />
            <span className="text-sm mt-2">Reveal</span>
          </button>
          <button onClick={handleRestart} className="flex flex-col items-center">
            <FontAwesomeIcon icon={faRedo} size="2x" className="text-green-500" />
            <span className="text-sm mt-2">Restart</span>
          </button>
          <button onClick={handleDeleteRoom} className="flex flex-col items-center">
            <FontAwesomeIcon icon={faTrash} size="2x" className="text-red-500" />
            <span className="text-sm mt-2">Delete Room</span>
          </button>
          <CopyToClipboard text={customURL} onCopy={handleCopyRoomId}>
            <button className="flex flex-col items-center">
              <FontAwesomeIcon icon={faLink} size="2x" className="text-yellow-500" />
              <span className="text-sm mt-2">Invite Link</span>
            </button>
          </CopyToClipboard>
        </div>
      </div>

      {/* Submit Estimate Section */}
      <div className="submit-section max-w-5xl w-full p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Submit Your Estimate</h2>
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
        <button onClick={handleEstimate} className="button-23">Submit Estimate</button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Success Message for Copy */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {alertMessage}
        </div>
      )}

      {/* URL Container */}
      {showURLContainer && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
            <button onClick={() => setShowURLContainer(false)} className="absolute top-2 right-2 text-red-500 text-lg">&times;</button>
            <h2 className="text-lg font-bold mb-4">Room Details</h2>
            <p className="mb-2"><strong>Room Name:</strong> {roomDetails?.name}</p>
            <p className="mb-4"><strong>Session ID:</strong> {roomId}</p>
            <div className="flex items-center mb-4">
              <CopyToClipboard text={customURL} onCopy={handleCopyRoomId}>
                <button className="button-23">Copy Room URL</button>
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
