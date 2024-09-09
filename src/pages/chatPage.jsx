import { useState, useEffect } from "preact/hooks"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"
import InstructionsLayout from "../components/InstructionsLayout"
import ToggleInstructionsButton from "../components/ToggleInstructionsButton" 

const chatInstructions = [
    {
        step: 1,
        color: "blue",
        title: "Connect",
        description: "Enter peer ID and click 'Connect'.",
    },
    {
        step: 2,
        color: "green",
        title: "Message",
        description: "Type and send your message.",
    },
    {
        step: 3,
        color: "yellow",
        title: "Send File",
        description: "Click paperclip to select a file.",
    },
    {
        step: 4,
        color: "red",
        title: "Encrypt",
        description: "Click 'Encrypt & Send' to send file.",
    },
    {
        step: 5,
        color: "purple",
        title: "Decrypt",
        description: "Click 'Decrypt' to view received file.",
    },
]

export default function ChatPage({ connectPeerId }) {
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <ChatLayout connectPeerId={connectPeerId} instructions={null}>
            <div className="w-full mb-4">
                <ChatMessages />
                <MessageInput />
            </div>

            {isSmallScreen && (
                <ToggleInstructionsButton
                    showInstructions={showInstructions}
                    onClick={() => setShowInstructions(!showInstructions)}
                />
            )}

            {(showInstructions || !isSmallScreen) && (
                <div className="w-full mt-4">
                    <InstructionsLayout
                        title="How Secure Chat Works"
                        steps={chatInstructions}
                    />
                </div>
            )}
        </ChatLayout>
    )
}
