export default function PeerIdDisplay({ peerId, handleInvite, recalculatePeerId, handleCopyPeerId }) {
    return (
      <div className="flex items-center space-x-2 mb-4">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID:</p>
        <div className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold">{peerId}</span>
          <img src={inviteIcon} alt="Invite Icon" className="w-6 h-6 cursor-pointer" onClick={handleInvite} />
          <FaSyncAlt className="w-6 h-6 text-yellow-500 cursor-pointer" onClick={recalculatePeerId} />
          <img src={copyIcon} alt="Copy Icon" className="w-6 h-6 cursor-pointer" onClick={handleCopyPeerId} />
        </div>
      </div>
    );
  }
  