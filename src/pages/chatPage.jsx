import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ChatInstruction from "../components/chatInstruction"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"

/**
 * ChatPage component that renders the entire chat interface.
 * It includes the chat layout, instructions, messages, input field, and toast notifications.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.connectPeerId - Function to connect to a specific peer ID.
 */
export default function ChatPage({ connectPeerId }) {
    return (
        <ChatLayout connectPeerId={connectPeerId}>
            <div className="flex">
                <ChatInstruction />
                <div className="w-3/4 pl-4">
                    <ChatMessages />
                    <MessageInput />
                </div>
            </div>
            <ToastContainer />
        </ChatLayout>
    )
}
