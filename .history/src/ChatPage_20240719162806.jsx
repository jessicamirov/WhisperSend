import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { PeerIdContext } from './PeerIdContext';
import { route } from 'preact-router';
import { FaSyncAlt } from 'react-icons/fa';
import inviteIcon from './assets/send1.png'; // Adjust the path as needed

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover
