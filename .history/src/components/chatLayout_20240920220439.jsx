import { useContext, useState, useEffect } from "preact/hooks"
import { PeerIdContext } from "./peerIdContext"
import ConfirmModal from "../utils/confirmModal"
import { route } from "preact-router"

/**
 * ChatLayout provides the layout for the chat interface and handles peer connection display, disconnection, 
 * and instructions. 
 * 
 * Features:
 * - Displays the peer ID and controls for disconnecting or showing peer info.
 * - Responsive layout for small and large screens.
 * - Modal to show peer details on small screens.
 */

export default function ChatLayout({ connectPeerId, children, instructions }) {
    const { disconnect, showExitButton, handleExit, isDisconnected, peerId } =
        useContext(PeerIdContext)
    const [showPeerModal, setShowPeerModal] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleDisconnect = () => {
        disconnect(true)
        route("/shareSecurely")
    }

    useEffect(() => {
        console.log("isDisconnected in ChatLayout:", isDisconnected)
    }, [isDisconnected])

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            {!isSmallScreen && (
                <div className="flex items-center justify-between w-full bg-white dark:bg-gray-800 p-1 rounded-xl shadow-2xl mb-4">
                    <div className="flex items-center space-x-2 truncate">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            Peer ID you're chatting with:
                        </p>
                        <span
                            className="text-xs font-bold bg-gray-700 text-white px-2 py-1 rounded-lg"
                            style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
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
            )}

            {isSmallScreen && (
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                        onClick={handleDisconnect}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        Disconnect
                    </button>
                    <button
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                        onClick={() => setShowPeerModal(true)}
                    >
                        Show Peers Info
                    </button>
                </div>
            )}

            {showPeerModal && (
                <ConfirmModal
                    title="Peer Information"
                    message={
                        <span>
                            <strong>Your Peer ID:</strong> {peerId}
                            <br />
                            <strong>Peer ID you're chatting with:</strong>{" "}
                            {connectPeerId}
                        </span>
                    }
                    onConfirm={() => setShowPeerModal(false)}
                    onCancel={() => setShowPeerModal(false)}
                />
            )}

            <div className="w-full flex-grow mb-4">
                <div className="w-full flex flex-col bg-white dark:bg-gray-800 p-1 rounded-xl shadow-2xl overflow-hidden">
                    {children}
                </div>
            </div>

            {instructions && (
                <div className="w-full mt-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl">
                        {instructions}
                    </div>
                </div>
            )}
        </div>
    )
}
