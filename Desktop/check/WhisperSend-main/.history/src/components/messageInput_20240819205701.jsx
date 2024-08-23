import { useContext } from "preact/hooks";
import { FaPaperclip, FaSmile } from "react-icons/fa";
import { handleSendMessage, handleSendFile } from "../utils/chatActions";
import { PeerIdContext } from "../components/peerIdContext";

export default function MessageInput() {
    const {
        connection,
        messages,
        setMessages,
        message,
        setMessage,
        myWallet,
        peerId,
        recipientPeerId,
    } = useContext(PeerIdContext);

    return (
        <div className="flex items-center space-x-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                onChange={(e) =>
                    handleSendFile({
                        e,
                        connection,
                        recipientPeerId,
                        myWallet,
                        peerId,
                        setMessages,
                        messages,
                    })
                }
            />
            <FaSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
            <button
                onClick={() =>
                    handleSendMessage({
                        message,
                        connection,
                        recipientPeerId,
                        messages,
                        myWallet,
                        peerId,
                        setMessages,
                        setMessage,
                    })
                }
                className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
                Send
            </button>
        </div>
    );
}
