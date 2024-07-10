import { h } from 'preact';
import { useState } from 'preact/hooks';

const SecureChat = () => {
  const [peerId, setPeerId] = useState('123456');
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
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID: {peerId}</p>
          </div>
          <div className="space-x-4">
            <button 
              onClick={handleInvite} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Send Invite
            </button>
            <button 
              onClick={handleRecalculateKeys} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Recalculate Keys
            </button>
          </div>
        </div>
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
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
        >
          Connect
        </button>
        {errorMessage && (
          <p className="mt-6 text-red-500 text-lg font-semibold">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SecureChat;
