import { h } from "preact"
import PeerIdDisplay from "./peerIdDisplay"
import { useContext } from "preact/hooks"
import { PeerIdContext } from "./peerIdContext"
import { route } from "preact-router"

export default function ChatLayout({ peerId, connectPeerId, children }) {
    const { disconnect, showExitButton, handleExit } = useContext(PeerIdContext)

    const handleDisconnect = () => {
        disconnect(true)
        route("/shareSecurely")
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            {/* Peer ID של המשתמש הנוכחי */}
            <div className="w-full max-w-7xl mb-4">
                <PeerIdDisplay
                    peerId={peerId}
                    customStyle="w-full"
                    title=""
                    showIcons={true}
                />
            </div>

            {/* קונטיינר של Peer ID השני והכפתור בשורה אחת */}
            <div className="flex items-center justify-between w-full max-w-7xl bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-4">
                <div className="flex items-center space-x-2 truncate">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        Chatting with peer:
                    </p>
                    <span
                        className="text-xs font-bold bg-gray-700 text-white px-2 py-1 rounded-lg truncate"
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "65%",
                        }}
                    >
                        {connectPeerId}
                    </span>
                </div>
                <div className="flex space-x-2 ml-4">
                    {showExitButton ? (
                        <button
                            onClick={handleExit}
                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                        >
                            Exit
                        </button>
                    ) : (
                        <button
                            onClick={handleDisconnect}
                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                        >
                            Disconnect
                        </button>
                    )}
                </div>
            </div>

            {/* חלון הצ'אט מוגדל */}
            <div className="flex-grow flex w-full max-w-7xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl overflow-auto">
                <div className="w-full h-full flex flex-col">
                    {children} {/* הצגת הודעות והכנסת הודעה חדשה */}
                </div>
            </div>
        </div>
    )
}
