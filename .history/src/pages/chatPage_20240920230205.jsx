import { useState, useEffect } from "preact/hooks"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"
import InstructionsLayout from "../components/instructionsLayout"
import { chatInstructions } from "../components/instructions"
import ToggleInstructionsButton from "../components/toggleInstructionsButton"
import { FaLock } from "react-icons/fa"

/**
 * ChatPage component contains the full chat interface, including:
 * Chat messages display.
 * Sending and receiving messages.
 * File sharing.
 * Instructions for how secure chat works.
 * The interface adapts to different screen sizes and allows toggling instructions on smaller screens.
 */
export default function ChatPage({ connectPeerId }) {
    // State to manage the visibility of instructions
    const [showInstructions, setShowInstructions] = useState(false)
    // State to check if the screen size is considered small (less than 768px)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)
    /**
     * useEffect hook to handle window resize and update the screen size state.
     * This effect adds an event listener for window resizing and cleans up on component unmount.
     */
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
                <div className="flex items-start justify-center mt-0 p-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
                        Your messages are encrypted end-to-end
                        <FaLock className="ml-1 w-3 h-3" />
                    </p>
                </div>
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
