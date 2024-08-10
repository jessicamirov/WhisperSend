import { useContext } from "preact/hooks"
import { PeerIdContext } from "./peerIdContext"

export default function ChatMessages() {
    const { messages, peerId } = useContext(PeerIdContext)
    // הקוד הקיים שלך...

    const handleDecryptAndDownload = (msg) => {
        console.log("Decrypting file:", msg.content)

        const decryptedFileURL = decryptFile(
            msg.url,
            recipientPeerId,
            myWallet.privateKey,
        )
        if (decryptedFileURL) {
            const fileName = msg.content.replace("encrypted", "decrypted") // שינוי שם הקובץ המפוענח

            // יצירת אלמנט <a> דינמי להורדה
            const link = document.createElement("a")
            link.href = decryptedFileURL
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // הסרת האלמנט לאחר ההורדה

            toast.success("File decrypted and downloading...")
        } else {
            toast.error("File decryption failed.")
        }
    }


    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 overflow-y-auto h-96 mb-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg ${msg.sender === peerId ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-gray-900 mr-auto"}`}
                    style={{
                        maxWidth: "75%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {msg.sender === peerId ? "You" : "Peer"}
                        </span>
                        <span>
                            {msg.type === "text" ? (
                                msg.content
                            ) : (
                                <>
                                    <a
                                        href={msg.url}
                                        className="text-white underline"
                                        download={msg.content}
                                    >
                                        {msg.content}{" "}
                                        {msg.sender === peerId
                                            ? "(Sent)"
                                            : "(Received)"}
                                    </a>
                                    {msg.sender !== peerId && (
                                        <>
                                            {msg.encrypted ? (
                                                <button
                                                    onClick={() =>
                                                        handleDecryptAndDownload(
                                                            msg,
                                                        )
                                                    }
                                                    className="ml-2 bg-green-500 text-white py-1 px-2 rounded"
                                                >
                                                    Decrypt and Download
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        window.open(
                                                            msg.url,
                                                            "_blank",
                                                        )
                                                    }
                                                    className="ml-2 bg-green-500 text-white py-1 px-2 rounded"
                                                >
                                                    Download
                                                </button>
                                            )}
                                            {msg.encrypted && (
                                                <span className="text-white ml-2">
                                                    (Encrypted)
                                                </span>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
