import { useState, useContext, useEffect, useRef } from "preact/hooks"
import { FaPaperclip, FaSmile } from "react-icons/fa"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { handleSendMessage, handleSendFile } from "../utils/chatActions"
import { PeerIdContext } from "../components/peerIdContext"
import { toast } from "react-toastify"

/**
 * This component handles the input and sending of chat messages,files and emojis.
 * Messages can be sent by pressing "Enter" or by clicking the "Send" button. 
 * Files can be attached and sent using the file input.
 * Allows the user to select and append emojis to the message.
 * Disables input and sending when disconnected or if disconnection has been initiated.
 */

export default function MessageInput() {
    const {
        connection,// Connection object for sending messages/files
        messages,// List of chat messages
        setMessages, // Function to update messages state
        message, // Current input message
        setMessage, // Function to update message state
        myWallet,// User's wallet containing the private key
        peerId,// Current user's Peer ID
        recipientPeerId,
        openConfirmModal,
        isDisconnected,
        initiatedDisconnect,
    } = useContext(PeerIdContext)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isInputDisabled, setIsInputDisabled] = useState(false) 

    useEffect(() => {
        if (!isDisconnected) {
            setIsInputDisabled(false)// Enable inputs when connected
        } else {
            setIsInputDisabled(true)// Disable inputs when disconnected
        }
    }, [isDisconnected]) 

    // Appends selected emoji to message
    const handleEmojiSelect = (emoji) => {
        setMessage(message + emoji.native)
        setShowEmojiPicker(false)
    }

 
    // Handle message sending on "Enter" key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (isInputDisabled || initiatedDisconnect) {
                toast.error(
                    "You are disconnected or already disconnected. Cannot send messages.",
                )
                return
            }
            if (!connection) {
                toast.error(
                    "Connection is not established yet. Please try again.",
                )
                return
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
            })
        }
    }

    return (
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
            <div className="w-full">
                <input
                    type="text"
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-xs md:text-base"
                    disabled={isInputDisabled || initiatedDisconnect}
                />
            </div>

            <div className="flex justify-center items-center space-x-4 w-full md:w-auto">
                <FaPaperclip
                    className={`w-8 h-8 sm:w-6 sm:h-6 text-gray-500 cursor-pointer ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() =>
                        !isInputDisabled &&
                        document.getElementById("fileInput").click()
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
                    className={`w-8 h-8 sm:w-6 sm:h-6 text-gray-500 cursor-pointer ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    disabled={isInputDisabled}
                />

                <button
                    onClick={() => {
                        if (isInputDisabled || initiatedDisconnect) {
                            toast.error(
                                "You are disconnected or already disconnected. Cannot send messages.",
                            )
                            return
                        }
                        if (!connection) {
                            toast.error(
                                "Connection is not established yet. Please try again.",
                            )
                            return
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
                        })
                    }}
                    className={`w-24 px-4 py-3 sm:px-3 sm:py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 text-lg sm:text-base ${isInputDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={isInputDisabled || initiatedDisconnect}
                >
                    Send
                </button>
            </div>

            {showEmojiPicker && (
                <div className="absolute bottom-12 right-0">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
            )}
        </div>
    )
}
