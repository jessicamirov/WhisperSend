import { useContext, useState, useEffect } from "preact/hooks"
import { ethers } from "ethers"
import { decryptFile } from "../utils/encryption"
import { Buffer } from "buffer"
import { PeerIdContext } from "../components/peerIdContext"
import InstructionsLayout from "../components/InstructionsLayout"
import ToggleInstructionsButton from "../components/ToggleInstructionsButton"

export default function Decrypt() {
    const { myWallet } = useContext(PeerIdContext)
    const [file, setFile] = useState(null)
    const [mnemonic, setMnemonic] = useState("")
    const [useCustomMnemonic, setUseCustomMnemonic] = useState(false)
    const [message, setMessage] = useState("")
    const [isDecrypted, setIsDecrypted] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(false)
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false)

    const decryptionSteps = [
        {
            step: 1,
            color: "blue",
            title: "Upload an encrypted file",
            description: "Choose an encrypted file to decrypt.",
        },
        {
            step: 2,
            color: "green",
            title: "Enter encryption key",
            description: "Enter the encryption key or use your mnemonic.",
        },
        {
            step: 3,
            color: "yellow",
            title: "Decrypt",
            description: 'Click the "Decrypt" button to decrypt the file.',
        },
        {
            step: 4,
            color: "red",
            title: "Download decrypted file",
            description:
                "Download the decrypted file once the process is complete.",
        },
    ]

    useEffect(() => {
        const mnemonicShown = sessionStorage.getItem("mnemonicSaved")
        if (!mnemonicShown) {
            setShowMnemonicPopup(true) 
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768) 
        }

        window.addEventListener("resize", handleResize)
        handleResize() 

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage("")
        setIsDecrypted(false)
    }

    const handleDecrypt = async () => {
        if (!file) return

        setMessage("Decrypting file, please wait...")

        try {
            const wallet = useCustomMnemonic
                ? ethers.Wallet.fromPhrase(mnemonic)
                : myWallet
            const privateKey = wallet.privateKey

            const reader = new FileReader()
            reader.onload = () => {
                const encryptedJson = JSON.parse(
                    Buffer.from(reader.result).toString(),
                )
                const decryptedBuffer = decryptFile(
                    JSON.stringify(encryptedJson),
                    wallet.publicKey,
                    privateKey,
                )

                if (!decryptedBuffer) {
                    setMessage("Decryption failed. Please check your mnemonic.")
                    return
                }

                const blob = new Blob([decryptedBuffer], {
                    type: "application/octet-stream",
                })

                const originalFileName = file.name.replace(".encrypted", "")
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = originalFileName
                link.click()

                setIsDecrypted(true)
                setMessage("File decrypted successfully!")
            }

            reader.readAsArrayBuffer(file)
        } catch (error) {
            console.error("Error during decryption:", error)
            setMessage("An error occurred during decryption.")
        }
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
            setShowMnemonicPopup(false)
        } else {
            alert("Please confirm that you have saved your mnemonic.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
                    Self-Decryption
                </h2>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Upload an encrypted file:
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleDecrypt}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
                >
                    Decrypt
                </button>
                {message && (
                    <p className="mt-6 text-green-500 text-lg font-semibold">
                        {message}
                    </p>
                )}
            </div>
            {isSmallScreen && (
                <ToggleInstructionsButton
                    showInstructions={showInstructions}
                    onClick={() => setShowInstructions(!showInstructions)}
                />
            )}
            {(showInstructions || !isSmallScreen) && (
                <div className="w-full max-w-5xl mx-auto">
                    <InstructionsLayout
                        title="How Decryption Works"
                        steps={decryptionSteps}
                    />
                </div>
            )}
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
        </div>
    )
}
