import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { PeerIdContext } from '../components/peerIdContext';
import { FaSyncAlt } from 'react-icons/fa';
import inviteIcon from '../assets/send1.png';
import copyIcon from "../assets/copy.png";

export default function PeerIdDisplay({ handleInvite, handleCopyPeerId }) {
  const { peerId, recalculatePeerId } = useContext(PeerIdContext);

  return (
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
  );
}
