import { useContext, useState, useEffect } from "preact/hooks"
import { ethers } from "ethers"
import { getSharedSecret } from "../utils/encryption"
import { Buffer } from "buffer"
import { PeerIdContext } from "../components/peerIdContext"
import nacl from "tweetnacl"
import InstructionsLayout from "../components/instructionsLayout"
import { decryptionInstructions } from "../components/instructions"
import ToggleInstructionsButton from "../components/toggleInstructionsButton"
import MnemonicPopup from "../utils/mnemonicPopup"

export default function Decrypt({ showMnemonicPopup, onConfirmMnemonic }) {
    const { myWallet } = useContext(PeerIdContext)
    const [file, setFile] = useState(null)
    const [mnemonic, setMnemonic] = useState("")
    const [useCustomMnemonic, setUseCustomMnemonic] = useState(false)
    const [peerPublicKey, setPeerPublicKey] = useState("")
    const [message, setMessage] = useState("")
    const [isDecrypted, setIsDecrypted] = useState(false)
    const [isChatFile, setIsChatFile] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    // File selection handler
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage("")
        setIsDecrypted(false)
    }
    const decryptFilefromEncrypt = (
        encryptedMessage,
        senderPublicKey,
        recipientPrivateKey,
    ) => {
        try {
            const encryptedObj = JSON.parse(encryptedMessage)
            const { nonce, encrypted, type } = encryptedObj

            // בדיקה אם סוג הקובץ קיים, ואם לא אז הגדרה לערך ברירת מחדל
            const fileType = type || "application/octet-stream"

            const sharedSecret = getSharedSecret(
                senderPublicKey,
                recipientPrivateKey,
            )

            const decrypted = nacl.box.open.after(
                Uint8Array.from(Buffer.from(encrypted, "hex")),
                Uint8Array.from(Buffer.from(nonce, "hex")),
                sharedSecret,
            )

            if (decrypted) {
                return new Blob([Buffer.from(decrypted)], {
                    type: fileType,
                })
            } else {
                console.error(
                    "Decryption failed. Check keys, nonce, and encrypted values.",
                )
                return null
            }
        } catch (error) {
            console.error("Decryption process error:", error)
            return null
        }
    }

    const handleNonChatDecrypt = async () => {
        if (!file) return

        setMessage("Decrypting file, please wait...")

        try {
            const wallet = useCustomMnemonic
                ? ethers.Wallet.fromPhrase(mnemonic)
                : myWallet
            const privateKey = wallet.privateKey
            console.log("DECRYPT-private key: ", privateKey)
            const reader = new FileReader()
            reader.onload = () => {
                const encryptedJson = JSON.parse(
                    Buffer.from(reader.result).toString(),
                )

              
                const { fileType } = encryptedJson // משחזר את סוג הקובץ המוצפן
                console.log("fileType")
                console.log(fileType)
                const decryptedBuffer = decryptFilefromEncrypt(
                    JSON.stringify(encryptedJson),
                    wallet.publicKey,
                    privateKey,
                )

                if (!decryptedBuffer) {
                    setMessage("Decryption failed. Please check your mnemonic.")
                    return
                }

                const blob = new Blob([decryptedBuffer], {
                    type: fileType || "application/octet-stream", // שימוש בסוג הקובץ או ברירת מחדל
                })

                const originalFileName = file.name.replace(".json", "") // שינוי הסיומת חזרה לשם מקורי
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

    const handleDecrypt = async () => {
        if (!file) {
            console.log("No file selected.")
            return
        }
        console.log("Starting decryption...")

        try {
            const wallet = useCustomMnemonic
                ? ethers.Wallet.fromPhrase(mnemonic)
                : myWallet

            const privateKey = wallet.privateKey

            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const fileContent = Buffer.from(reader.result).toString()
                    console.log("File content (raw):", fileContent)

                    if (!isChatFile) {
                        handleNonChatDecrypt(fileContent)
                        return
                    }

                    let encryptedJson
                    try {
                        encryptedJson = JSON.parse(fileContent)
                        console.log("Parsed JSON:", encryptedJson)
                    } catch (jsonParseError) {
                        console.error(
                            "File content is not valid JSON:",
                            jsonParseError,
                        )
                        setMessage("File format is incorrect or not encrypted.")
                        return
                    }

                    const { nonce, encrypted, fileType } = encryptedJson
                    console.log("Nonce:", nonce)
                    console.log("Encrypted data:", encrypted)

                    const nonceBuffer = Buffer.from(nonce, "hex")
                    const encryptedBuffer = Buffer.from(encrypted, "hex")

                    console.log("Nonce Buffer:", nonceBuffer)
                    console.log("Encrypted Buffer:", encryptedBuffer)

                    if (!peerPublicKey) {
                        setMessage(
                            "Peer public key is required for decryption.",
                        )
                        return
                    }

                    const sharedSecret = getSharedSecret(
                        peerPublicKey,
                        privateKey,
                    )

                    if (!sharedSecret) {
                        console.error("Failed to generate shared secret.")
                        setMessage("Failed to generate shared secret.")
                        return
                    }

                    console.log("Shared Secret:", sharedSecret.toString("hex"))

                    const decryptedBuffer = nacl.box.open.after(
                        encryptedBuffer,
                        nonceBuffer,
                        sharedSecret,
                    )
                    if (!decryptedBuffer) {
                        console.error("Decryption failed.")
                        setMessage("Decryption failed. Please check your keys.")
                        return
                    }

                    console.log("Decrypted content:", decryptedBuffer)

                    const blob = new Blob([decryptedBuffer], {
                        type: fileType || "application/octet-stream",
                    })

                    const originalFileName = `decryptedFile.${fileType ? fileType.split("/").pop() : "bin"}`
                    const link = document.createElement("a")
                    link.href = URL.createObjectURL(blob)
                    link.download = originalFileName
                    link.click()

                    setIsDecrypted(true)
                    setMessage("File decrypted successfully!")
                } catch (error) {
                    console.error("Error during decryption:", error)
                    setMessage("Invalid file format or decryption failed.")
                }
            }

            reader.readAsArrayBuffer(file)
        } catch (error) {
            console.error("Error during decryption:", error)
            setMessage("An error occurred during decryption.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">
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
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Use custom mnemonic:
                    </label>
                    <input
                        type="checkbox"
                        checked={useCustomMnemonic}
                        onChange={() =>
                            setUseCustomMnemonic(!useCustomMnemonic)
                        }
                        className="mr-2"
                    />
                    {useCustomMnemonic && (
                        <input
                            type="text"
                            value={mnemonic}
                            onChange={(e) => setMnemonic(e.target.value)}
                            className="block w-full mt-2 text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your mnemonic"
                        />
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        A file from chat?
                    </label>
                    <input
                        type="checkbox"
                        checked={isChatFile}
                        onChange={() => setIsChatFile(!isChatFile)}
                        className="mr-2"
                    />
                </div>
                {isChatFile && (
                    <div className="mb-6">
                        <input
                            type="text"
                            value={peerPublicKey}
                            onChange={(e) => setPeerPublicKey(e.target.value)}
                            className="block w-full mt-2 text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the peer Id of the sender"
                        />
                    </div>
                )}
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
                        steps={decryptionInstructions}
                    />
                </div>
            )}
            {showMnemonicPopup && myWallet && (
                <MnemonicPopup
                    mnemonic={myWallet.mnemonic.phrase}
                    onConfirm={onConfirmMnemonic}
                />
            )}
        </div>
    )
}