import { useState, useContext, useEffect } from "preact/hooks"
import { PeerIdContext } from "../components/peerIdContext"
import PeerIdDisplay from "../components/peerIdDisplay"
import ConnectForm from "../components/connectForm"
import Invitation from "../components/invitation"
import InstructionsLayout from "../components/instructionsLayout"
import { chatInstructions } from "../components/instructions"
import ToggleInstructionsButton from "../components/toggleInstructionsButton"
import MnemonicPopup from "../utils/mnemonicPopup"

/**
 * ShareSecurely component allows users to initiate a secure peer-to-peer connection.
 * It includes features to copy/share the user's Peer ID, connect to another peer, and recalculate keys.
 */
export default function ShareSecurely({ showMnemonicPopup, onConfirmMnemonic }) {
    const { peerId, myWallet } = useContext(PeerIdContext)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

      /**
     * useEffect to handle resizing of the window. It sets the `isSmallScreen` state
     * based on the window width to adjust the layout accordingly.
     */
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

        /**
     * Toggles the state of the invitation modal (open/close).
     */
    const toggleInviteModal = () => {
        setIsInviteOpen(!isInviteOpen)
    }

      /**
     * Copies the user's Peer ID to the clipboard and shows a confirmation alert.
     */
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
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
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
                        steps={chatInstructions}
                    />
                )}
            </div>
            {isInviteOpen && <Invitation close={toggleInviteModal} />}
            {showMnemonicPopup && myWallet && (
                <MnemonicPopup
                    mnemonic={myWallet.mnemonic.phrase}
                    onConfirm={onConfirmMnemonic}
                />
            )}
        </div>
    )
}
