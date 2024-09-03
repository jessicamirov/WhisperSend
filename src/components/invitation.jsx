import { h, Fragment } from "preact"
import { useState, useEffect, useContext } from "preact/hooks"
import { PeerIdContext } from "./connectionManager"
import ConfirmModal from "../utils/confirmModal"
import { FaShareAlt } from "react-icons/fa" // ייבוא האייקון FaShareAlt מהספרייה react-icons

export default function Invitation({ close }) {
    const { peerId } = useContext(PeerIdContext)
    const [link, setLink] = useState("")

    const shareLink = async (title, url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `${title} - ${url}`,
                    url: url,
                })
                console.log("Link shared successfully")
            } catch (error) {
                console.error("Error sharing link:", error)
            }
        } else {
            console.warn("Web Share API is not supported in this browser")
        }
    }

    useEffect(() => {
        const l = `${window.location.origin}/chat/${peerId}`
        setLink(l)
    }, [peerId])

    const handleShareLink = () => {
        shareLink("Join me on WhisperSend!", link)
    }

    const handleSharePeerId = () => {
        const message = `Join me on WhisperSend! My Peer ID is: ${peerId}`
        shareLink("My Peer ID", message)
    }

    return (
        <ConfirmModal
            title="Invitation Link"
            message={
                <Fragment>
                    {/* כפתור "X" לסגירה */}
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={close}
                    >
                        &#x2715; {/* סימן ה-X */}
                    </button>

                    <p className="text-center text-sm mt-8">
                        Invitation link for peer-to-peer chat, ensuring
                        <strong> private</strong> and
                        <strong> secure communication</strong>
                        with asymmetric encryption.
                    </p>
                    <div
                        className="bg-gray-200 p-1 rounded-lg mt-2 cursor-pointer text-center"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            alert("Link copied to clipboard!")
                        }}
                    >
                        <textarea
                            className="w-full p-0 bg-transparent border-none cursor-pointer text-xs"
                            rows="1"
                            value={link}
                            readOnly
                        />
                    </div>
                    <div className="text-xs mt-2 text-center">
                        Click to copy and share this link with your contact to
                        start a secure chat.
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button
                            className="h-auto bg-blue-500 hover:bg-blue-700 text-white text-sm items-center flex justify-center py-1 px-3 rounded gap-2"
                            onClick={handleShareLink}
                        >
                            <FaShareAlt className="w-3 h-3 text-white cursor-pointer" />
                            <div>Share Link</div>
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold mb-2 text-center">
                            Share My Peer ID:
                        </p>
                        <div className="flex justify-center items-center space-x-2">
                            <span className="text-xs font-mono bg-gray-200 p-1 rounded-lg cursor-pointer">
                                {peerId}
                            </span>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button
                                type="button"
                                className="h-auto bg-blue-500 hover:bg-blue-700 text-white text-sm items-center flex justify-center py-1 px-3 rounded gap-2"
                                onClick={handleSharePeerId}
                            >
                                <FaShareAlt className="w-3 h-3 text-white cursor-pointer" />
                                <div>Share My Peer ID</div>
                            </button>
                        </div>
                    </div>
                </Fragment>
            }
            onConfirm={() => {
                navigator.clipboard.writeText(link)
                alert("Link copied to clipboard!")
                close() // סגירת המודאל לאחר ההעתקה
            }}
            onCancel={close} // סגירת המודאל מבלי לבצע פעולה
        />
    )
}
