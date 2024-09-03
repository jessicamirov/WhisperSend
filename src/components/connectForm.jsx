import { h } from "preact"
import { useState, useContext } from "preact/hooks"
import { PeerIdContext } from "./connectionManager"

export default function ConnectForm() {
    const { connectToPeer } = useContext(PeerIdContext)
    const [connectPeerId, setConnectPeerId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isConnecting, setIsConnecting] = useState(false) // משתנה חדש כדי לעקוב אחרי מצב החיבור

    const handleConnect = () => {
        if (!connectPeerId) {
            setErrorMessage("Error: Please enter a peer ID.")
            return
        }

        setIsConnecting(true) // עדכון המצב שהחיבור בתהליך
        connectToPeer(connectPeerId)
            .then(() => {
                setIsConnecting(false) // החיבור הצליח, ניתן לאפס את המצב
                setErrorMessage("")
            })
            .catch((err) => {
                setIsConnecting(false) // החיבור נכשל, ניתן לאפס את המצב
                setErrorMessage("Connection failed: " + err.message)
            })
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
                disabled={isConnecting} // חוסם את השדה במהלך החיבור
            />
            <button
                onClick={handleConnect}
                className={`w-full px-4 py-3 ${isConnecting ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-blue-800"} text-white font-bold rounded-lg shadow-lg transition duration-300 mt-4`}
                disabled={isConnecting} // חוסם את הכפתור במהלך החיבור
            >
                {isConnecting ? "Connecting..." : "Connect"}
            </button>
            {errorMessage && (
                <p className="mt-6 text-red-500 text-lg font-semibold">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
