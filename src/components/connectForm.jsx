import { h } from "preact"
import { useState, useContext } from "preact/hooks"
import { Context } from "../utils/context" // ייבוא של הקונטקסט המרכזי
import { route } from "preact-router"

export default function ConnectForm() {
    const { state, dispatch } = useContext(Context) // שימוש ב-context המעודכן
    const [connectPeerId, setConnectPeerId] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleConnect = () => {
        if (!connectPeerId) {
            setErrorMessage("Error: Please enter a peer ID.")
            return
        }

        // קריאה לפונקציה connectToPeer דרך dispatch
        dispatch({ type: "CONNECT_PEER", payload: connectPeerId })
        setErrorMessage("")

        // לא עושים redirect לעמוד הצ'אט עד שהחיבור הושלם
        route(`/chat/${connectPeerId}`)
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
            />
            <button
                onClick={handleConnect}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 mt-4"
            >
                Connect
            </button>
            {errorMessage && (
                <p className="mt-6 text-red-500 text-lg font-semibold">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
