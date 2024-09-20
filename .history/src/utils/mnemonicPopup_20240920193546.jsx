import { useState, useEffect } from "preact/hooks"

/**
 * Displays a popup for the user to save their mnemonic phrase, which is required for recovery.
 * The user must confirm they have saved the phrase before dismissing the popup.
 * Once confirmed, the popup won't appear again as the confirmation is stored in localStorage.
 */
export default function MnemonicPopup({ mnemonic, onConfirm }) {
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false)

    const handleDownloadMnemonic = () => {
        const blob = new Blob([mnemonic], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "mnemonic.txt"
        link.click()
    }

const handleCopyMnemonic = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      
        navigator.clipboard
            .writeText(mnemonic)
            .then(() => {
                alert("Mnemonic copied to clipboard!") 
            })
            .catch((err) => {
                console.error(
                    "Failed to copy mnemonic using clipboard API: ",
                    err,
                )
          
            })
    } else {
        console.error("Clipboard API not supported or available.")
    }
}

    const handleConfirm = () => {
        if (isMnemonicConfirmed) {
            localStorage.setItem("mnemonicConfirmed", "true")
            onConfirm()
        } else {
            alert("Please confirm that you saved the mnemonic.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Mnemonic phrase</h2>
                <p className="mb-2 text-gray-600">
                    A mnemonic phrase is a series of words that represent your
                    personal key. You will need it to recover your files in the
                    future, so it's very important to keep it in a safe place.
                </p>
                <div
                    className="bg-gray-200 p-4 rounded mb-4 cursor-pointer"
                    onClick={handleCopyMnemonic}
                >
                    {mnemonic}
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
                    onClick={handleConfirm}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}
