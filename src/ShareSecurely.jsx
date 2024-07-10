import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FaUserPlus, FaSyncAlt } from 'react-icons/fa';

const ShareSecurely = () => {
  const [peerId] = useState('1389838195');
  const [connectPeerId, setConnectPeerId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInvite = () => {
    // Add your invite logic here
    alert('Invite sent!');
  };

  const handleRecalculateKeys = () => {
    // Add your recalculate keys logic here
    alert('Keys recalculated!');
  };

  const handleConnect = () => {
    if (!connectPeerId) {
      setErrorMessage('Error: Please enter a peer ID.');
      return;
    }

    // Add your connect logic here
    alert(`Connected to peer ${connectPeerId}`);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105 mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID:</p>
          <div className="flex items-center space-x-4 bg-gray-700 text-white px-4 py-2 rounded-lg">
            <span className="text-2xl font-bold">{peerId}</span>
            <FaUserPlus className="w-6 h-6 text-red-500 cursor-pointer" onClick={handleInvite} />
            <FaSyncAlt className="w-6 h-6 text-gray-500 cursor-pointer" onClick={handleRecalculateKeys} />
          </div>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">Secure Chat</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Connect with Peer</label>
          <input 
            type="text" 
            value={connectPeerId}
            onChange={(e) => setConnectPeerId(e.target.value)}
            className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter peer ID"
          />
        </div>
        <button 
          onClick={handleConnect} 
          className="w-full px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Connect
        </button>
        {errorMessage && (
          <p className="mt-6 text-red-500 text-lg font-semibold">{errorMessage}</p>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How Secure Chat Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center mb-4">
            <div className="step-circle bg-blue-500">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Send Invite</h4>
              <p className="text-gray-600 dark:text-gray-400">Send an invite to your peer to start a secure chat session.</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="step-circle bg-green-500">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Connect</h4>
              <p className="text-gray-600 dark:text-gray-400">Enter the peer ID of your contact and connect securely.</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="step-circle bg-yellow-500">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Chat Securely</h4>
              <p className="text-gray-600 dark:text-gray-400">Start chatting securely and send encrypted files.</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="step-circle bg-red-500">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Recalculate Keys</h4>
              <p className="text-gray-600 dark:text-gray-400">Recalculate your encryption keys regularly for added security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSecurely;
