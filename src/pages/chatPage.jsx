import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ChatInstruction from "../components/chatInstruction"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"
import { useContext, useEffect } from "preact/hooks"
import { Context } from "../utils/context" // ייבוא הקונטקסט המרכזי

/**
 * ChatPage component that renders the entire chat interface.
 * It includes the chat layout, instructions, messages, input field, and toast notifications.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.connectPeerId - The peer ID to connect to.
 */
export default function ChatPage({ connectPeerId }) {
    const { dispatch } = useContext(Context) // שימוש ב-context המעודכן

    useEffect(() => {
        if (connectPeerId) {
            // ביצוע חיבור אוטומטי ל-peer באמצעות dispatch
            dispatch({ type: "CONNECT_PEER", payload: connectPeerId })
        }
    }, [connectPeerId, dispatch])

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
