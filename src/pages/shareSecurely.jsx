import { h } from "preact"
import { useState, useContext } from "preact/hooks"
import { PeerIdContext } from "../components/connectionManager"
import PeerIdDisplay from "../components/peerIdDisplay"
import ConnectForm from "../components/connectForm"
import Invitation from "../components/invitation"
import InstructionsLayout from "../components/instructionsLayout"

const secureChatSteps = [
    {
        step: 1,
        color: "blue",
        title: "Send Invite",
        description:
            "Send an invite to your peer to start a secure chat session.",
    },
    {
        step: 2,
        color: "green",
        title: "Connect",
        description: "Enter the peer ID of your contact and connect securely.",
    },
    {
        step: 3,
        color: "yellow",
        title: "Chat Securely",
        description: "Start chatting securely and send encrypted files.",
    },
    {
        step: 4,
        color: "red",
        title: "Recalculate Keys",
        description:
            "Recalculate your encryption keys regularly for added security.",
    },
]

export default function ShareSecurely() {
    const { peerId } = useContext(PeerIdContext)
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    const toggleInviteModal = () => {
        setIsInviteOpen(!isInviteOpen)
    }

    const handleCopyPeerId = () => {
        navigator.clipboard
            .writeText(peerId)
            .then(() => {
                alert("Peer ID copied to clipboard!")
            })
            .catch((err) => {
                console.error("Could not copy text: ", err)
            })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <PeerIdDisplay
                        handleInvite={toggleInviteModal}
                        handleCopyPeerId={handleCopyPeerId}
                        customStyle="mb-4"
                        title="Secure Chat"
                        showIcons={true}
                        alignIcons="flex-start" // מיקום הכפתורים בצד שמאל במסכים קטנים
                    />
                    <ConnectForm />
                </div>

                <InstructionsLayout
                    title="Secure Chat Instructions"
                    steps={secureChatSteps}
                />
            </div>

            {isInviteOpen && <Invitation close={toggleInviteModal} />}
        </div>
    )
}
