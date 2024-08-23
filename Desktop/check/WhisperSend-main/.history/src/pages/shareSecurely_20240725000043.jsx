import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { PeerIdContext } from '../components/peerIdContext';
import { route } from 'preact-router';
import PeerIdDisplay from '../components/peerIdDisplay';
import ConnectForm from '../components/connectForm';
import StepsInfo from '../components/stepsInfo';

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
          <PeerIdDisplay 
            peerId={peerId} 
            recalculatePeerId={recalculatePeerId} 
            handleInvite={handleInvite} 
            handleCopyPeerId={handleCopyPeerId} 
          />
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">Secure Chat</h2>
        </div>
        <ConnectForm 
          connectPeerId={connectPeerId} 
          setConnectPeerId={setConnectPeerId} 
          handleConnect={handleConnect} 
          errorMessage={errorMessage} 
        />
      </div>
      <StepsInfo />
    </div>
  );
};

export default ShareSecurely;
