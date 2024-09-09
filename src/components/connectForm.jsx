import { useState, useContext } from "preact/hooks"
import { PeerIdContext } from "../components/peerIdContext"

export default function ConnectForm() {
    const { connectToPeer } = useContext(PeerIdContext)
    const [connectPeerId, setConnectPeerId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isConnecting, setIsConnecting] = useState(false) 
    const [connectionTimeout, setConnectionTimeout] = useState(null) 

    const handleConnect = () => {
        if (!connectPeerId) {
            setErrorMessage("Error: Please enter a peer ID.")
            return
        }

        setIsConnecting(true)
        setErrorMessage("")

        const timeout = setTimeout(() => {
            setIsConnecting(false)
            setErrorMessage("Connection attempt timed out.")
        }, 10000) 

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

    const handleCancel = () => {
        clearTimeout(connectionTimeout) 
        setIsConnecting(false) 
        setErrorMessage("Connection cancelled.")
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
