import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { PeerIdContext } from './PeerIdContext';
import { route } from 'preact-router';
import { FaSyncAlt } from 'react-icons/fa';
import inviteIcon from './assets/send1.png';
import copyIcon from './assets/copy.png';

const ShareSecurely = () => {
  const { peerId, recalculatePeerId, connectToPeer } = useContext(PeerIdContext);
  const [connectPeerId, setConnectPeerId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConnect = () => {
    if (!connectPeerId) {
      setErrorMessage('Error: Please enter a peer ID.');
      return;
    }

    connectToPeer(connectPeerId);
    setErrorMessage('');
    route(`/chat/${connectPeerId}`);
  };

  const handleInvite = () => {
    alert('Invite sent!');
  };

  const handleCopyPeerId = () => {
    navigator.clipboard.writeText(peerId).then(() => {
      alert('Peer ID copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105 mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID:</p>
            <div className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold">{peerId}</span>
              <img src={inviteIcon} alt="Invite Icon" className="w-6 h-6 cursor-pointer" onClick={handleInvite} />
              <FaSyncAlt className="w-6 h-6 text-yellow-500 cursor-pointer" onClick={recalculatePeerId} />
              <img src={copyIcon} alt="Copy Icon" className="w-6 h-6 cursor-pointer" onClick={handleCopyPeerId} />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">Secure Chat</h2>
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
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How Secure Chat Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">1</div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">Send Invite</h4>
            <p className="text-gray-600 dark:text-gray-400 text-center">Send an invite to your peer to start a secure chat session.</p>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl">2</div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">Connect</h4>
            <p className="text-gray-600 dark:text-gray-400 text-center">Enter the peer ID of your contact and connect securely.</p>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-xl">3</div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">Chat Securely</h4>
            <p className="text-gray-600 dark:text-gray-400 text-center">Start chatting securely and send encrypted files.</p>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xl">4</div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">Recalculate Keys</h4>
            <p className="text-gray-600 dark:text-gray-400 text-center">Recalculate your encryption keys regularly for added security.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSecurely;
