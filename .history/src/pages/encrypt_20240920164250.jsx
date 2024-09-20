import { useEffect, useContext, useState } from "preact/hooks";
import { Buffer } from "buffer";
import { encryptFile } from "../utils/encryption";
import { PeerIdContext } from "../components/peerIdContext";
import InstructionsLayout from "../components/instructionsLayout";
import { encryptionInstructions } from "../components/instructions"
import ToggleInstructionsButton from "../components/toggleInstructionsButton";
import MnemonicPopup from "../utils/mnemonicPopup";

export default function Encrypt({ showMnemonicPopup, onConfirmMnemonic }) {
    const { myWallet } = useContext(PeerIdContext)
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState("")
    const [isEncrypted, setIsEncrypted] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

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
        setIsEncrypted(false)
    }

    const handleEncrypt = async () => {
        if (!file) return

        setMessage("Encrypting file, please wait...")

        const privateKey = myWallet.privateKey
        const publicKey = myWallet.publicKey

        console.log("file.type")
        console.log(file.type)
        const reader = new FileReader()
        reader.onload = () => {
            const fileBuffer = Buffer.from(reader.result)

            // הוספת סוג הקובץ למידע המוצפן
            const encryptedData = encryptFile(fileBuffer, publicKey, privateKey)

            const encryptedFileData = {
                nonce: encryptedData.nonce,
                encrypted: encryptedData.encrypted,
                fileType: file.type, // שמירת סוג הקובץ
            }

            // יצירת Blob מהאובייקט המוצפן
            const blob = new Blob([JSON.stringify(encryptedFileData)], {
                type: "application/json", // השארת הסוג כ-JSON עבור ההורדה
            })

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `encrypted` // שם הקובץ בהורדה
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setIsEncrypted(true)
            setMessage(
                "File encrypted successfully! The file is downloading now.",
            )
        }
        reader.readAsArrayBuffer(file)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">
                    Self-Encryption
                </h2>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Choose a file:
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleEncrypt}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
                >
                    Encrypt & Save
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
                        title="How Encryption Works"
                        steps={encryptionInstructions}
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