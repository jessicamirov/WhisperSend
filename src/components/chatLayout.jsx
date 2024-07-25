// ChatLayout.jsx
import { h } from "preact";
import PeerIdDisplay from "./peerIdDisplay";

export default function ChatLayout({ peerId, connectPeerId, children }) {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <PeerIdDisplay
        peerId={peerId}
        customStyle=""
        title=""
        showIcons={false}
      />
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-8">
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center space-x-2">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              You are chatting with peer:
            </p>
            <span className="text-2xl font-bold bg-gray-700 text-white px-4 py-2 rounded-lg">
              {connectPeerId}
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
