import { useState, useContext } from "preact/hooks"
import { PeerIdContext } from "../components/peerIdContext"

/**
 * ConnectForm component allows users to input a Peer ID and attempt to connect with another peer.
 * It handles connection attempts, errors, and connection cancellation.
 * 
 * Features:
 * Connects to another peer using their Peer ID.
 * Prevents connecting to the user's own Peer ID.
 * Shows an error message if no Peer ID is provided or connection fails.
 * Allows the user to cancel the connection attempt.
 * 
 */

export default function ConnectForm() {
    const { connectToPeer, connection, peer, peerId } = useContext(PeerIdContext);   
    const [connectPeerId, setConnectPeerId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isConnecting, setIsConnecting] = useState(false) 
    const [connectionTimeout, setConnectionTimeout] = useState(null) 

    // Attempts to connect to the peer with the entered Peer ID and sets a timeout for the connection attempt

    const handleConnect = () => {
        if (!connectPeerId) {
            setErrorMessage("Error: Please enter a peer ID.")
            return
        }
        if (connectPeerId === peerId) {
            setErrorMessage("Error: You cannot connect to your own Peer ID.");
            return;
        }
        setIsConnecting(true)
        setErrorMessage("")

        // Sets a 3 minute timeout for the connection attempt. If it fails, stops the connection
        // and shows an error message.
        const timeout = setTimeout(() => {
            setIsConnecting(false)
            setErrorMessage("Connection attempt timed out.")
        }, 180000)

        setConnectionTimeout(timeout)

        connectToPeer(connectPeerId)
            .then(() => {
                clearTimeout(timeout)
                setIsConnecting(false)
                setErrorMessage("")
            })
            .catch((err) => {
                clearTimeout(timeout)
                setIsConnecting(false)
            })
    }
// Cancels the connection attempt and optionally sends a cancellation message if connection was started
    const handleCancel = () => {
        clearTimeout(connectionTimeout); 
        setIsConnecting(false); 
        setErrorMessage("Connection cancelled.");
    
        if (connection) {
                    // If a connection exists, send a cancellation message
            connection.send(JSON.stringify({ type: "connection-cancelled" }));
        } else if (peer && connectPeerId) {
                    // If no connection yet, connect and send cancellation
            const con = peer.connect(connectPeerId);
            con.on("open", () => {
                con.send(JSON.stringify({ type: "connection-cancelled" }));
                con.close();
            });
        }
        
    }

    return (
        <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Connect with Peer
            </label>
            <input
                type="text"
                value={connectPeerId}
                onChange={(e) => setConnectPeerId(e.target.value)}
                className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter peer ID"
                disabled={isConnecting} 
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={handleConnect}
                    className={`px-4 py-3 ${isConnecting ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-blue-800"} text-white font-bold rounded-lg shadow-lg transition duration-300 w-full ${isConnecting ? "mr-4" : ""}`}
                    disabled={isConnecting} 
                >
                    {isConnecting ? "Connecting..." : "Connect"}
                </button>

                {isConnecting && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg transition duration-300"
                    >
                        Cancel
                    </button>
                )}
            </div>
            {errorMessage && (
                <p className="mt-6 text-red-500 text-lg font-semibold">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
