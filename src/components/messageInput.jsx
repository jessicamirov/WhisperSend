import { useContext } from "preact/hooks"
import { FaPaperclip, FaSmile } from "react-icons/fa"
import { handleSendMessage, handleSendFile } from "../utils/chatActions" // ייבוא הפונקציות
import { Context } from "../utils/context" // ייבוא הקונטקסט המרכזי

export default function MessageInput() {
    const { state, dispatch } = useContext(Context) // שימוש ב-context כדי לקבל state ו-dispatch

    const handleSend = () => {
        handleSendMessage(state, dispatch) // העברת state ו-dispatch לפונקציה
    }

    const handleFileChange = (e) => {
        handleSendFile(e, state, dispatch) // העברת state ו-dispatch לפונקציה
    }

    return (
        <div className="flex items-center space-x-4">
            <input
                type="text"
                value={state.message}
                onChange={(e) =>
                    dispatch({ type: "SET_MESSAGE", payload: e.target.value })
                }
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaPaperclip
                className="w-6 h-6 text-gray-500 cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()}
            />
            <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <FaSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
            <button
                onClick={handleSend}
                className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
                Send
            </button>
        </div>
    )
}
