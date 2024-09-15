import { useState, useContext, useEffect } from "preact/hooks"
import { PeerIdContext } from "../components/peerIdContext"
import PeerIdDisplay from "../components/peerIdDisplay"
import ConnectForm from "../components/connectForm"
import Invitation from "../components/invitation"
import InstructionsLayout from "../components/instructionsLayout"
import ToggleInstructionsButton from "../components/toggleInstructionsButton"

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
    const { peerId, myWallet } = useContext(PeerIdContext)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(false)
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const isMnemonicSaved = sessionStorage.getItem("mnemonicSaved")
        const isMnemonicConfirmed = sessionStorage.getItem("mnemonicConfirmed")

        if (
            !isMnemonicSaved &&
            !isMnemonicConfirmed &&
            myWallet?.mnemonic?.phrase
        ) {
            setShowMnemonicPopup(true)
        }
    }, [myWallet])

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

    const handleDownloadMnemonic = () => {
        const blob = new Blob([myWallet.mnemonic.phrase], {
            type: "text/plain",
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "mnemonic.txt"
        link.click()
    }

    const handleConfirmMnemonic = () => {
        if (isMnemonicConfirmed) {
            sessionStorage.setItem("mnemonicSaved", "true")
            sessionStorage.setItem("mnemonicConfirmed", "true")
            setShowMnemonicPopup(false)
        } else {
            alert("Please confirm that you have saved your mnemonic.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
            {showMnemonicPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            Mnemonic Words
                        </h2>
                        <p className="mb-4">
                            Please save the following mnemonic phrase. You will
                            need it to decrypt your files.
                        </p>
                        <div className="bg-gray-200 p-4 rounded mb-4">
                            {myWallet.mnemonic.phrase}
                        </div>
                        <div className="mb-4">
                            <button
                                onClick={handleDownloadMnemonic}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Download Mnemonic
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="confirm"
                                className="mr-2"
                                checked={isMnemonicConfirmed}
                                onChange={() =>
                                    setIsMnemonicConfirmed(!isMnemonicConfirmed)
                                }
                            />
                            <label htmlFor="confirm" className="text-gray-700">
                                I have written down the mnemonic phrase
                            </label>
                        </div>
                        <button
                            onClick={handleConfirmMnemonic}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <PeerIdDisplay
                        handleInvite={toggleInviteModal}
                        handleCopyPeerId={handleCopyPeerId}
                        customStyle="mb-4"
                        title="Secure Chat"
                        showIcons={true}
                        alignIcons="flex-start"
                    />
                    <ConnectForm />
                </div>

                {isSmallScreen && (
                    <div className="flex justify-center mb-4">
                        <ToggleInstructionsButton
                            showInstructions={showInstructions}
                            onClick={() =>
                                setShowInstructions(!showInstructions)
                            }
                        />
                    </div>
                )}

                {(showInstructions || !isSmallScreen) && (
                    <InstructionsLayout
                        title="Secure Chat Instructions"
                        steps={secureChatSteps}
                    />
                )}
            </div>

            {isInviteOpen && <Invitation close={toggleInviteModal} />}
        </div>
    )
}
