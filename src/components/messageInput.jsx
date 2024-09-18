import { useState, useContext, useEffect, useRef } from "preact/hooks";
import { FaPaperclip, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { handleSendMessage, handleSendFile } from "../utils/chatActions";
import { PeerIdContext } from "../components/peerIdContext";
import { toast } from "react-toastify";

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
        openConfirmModal,
        isDisconnected,
        initiatedDisconnect,
    } = useContext(PeerIdContext);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false); // Control input and button disabled state

    // Enable inputs and buttons when component mounts (shifting from disconnected state)
    useEffect(() => {
        if (!isDisconnected) {
            setIsInputDisabled(false);
        } else {
            setIsInputDisabled(true);
        }
    }, [isDisconnected]); // This ensures the state reflects disconnection changes

    const handleEmojiSelect = (emoji) => {
        setMessage(message + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <div className="relative flex items-center space-x-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isInputDisabled || initiatedDisconnect} // Disable input based on connection state
            />

            <FaPaperclip
                className={`w-6 h-6 text-gray-500 cursor-pointer ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() =>
                    !isInputDisabled && document.getElementById("fileInput").click()
                }
            />
            <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={(e) =>
                    !isInputDisabled &&
                    handleSendFile({
                        e,
                        connection,
                        recipientPeerId,
                        myWallet,
                        peerId,
                        setMessages,
                        messages,
                        openConfirmModal,
                    })
                }
            />

            <FaSmile
                className={`w-6 h-6 text-gray-500 cursor-pointer ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isInputDisabled} // Disable emoji button
            />

            {showEmojiPicker && (
                <div className="absolute bottom-12 right-0">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
            )}

            <button
                onClick={() => {
                    if (isInputDisabled || initiatedDisconnect) {
                        toast.error("You are disconnected or already disconnected. Cannot send messages.");
                        return;
                    }
                    if (!connection) {
                        toast.error("Connection is not established yet. Please try again.");
                        return;
                    }
                    handleSendMessage({
                        message,
                        connection,
                        recipientPeerId,
                        messages,
                        myWallet,
                        peerId,
                        setMessages,
                        setMessage,
                    });
                }}
                className={`px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={isInputDisabled || initiatedDisconnect} // Disable the button based on ref
            >
                Send
            </button>
        </div>
    );
}
