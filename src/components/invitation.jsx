import { Fragment } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import { PeerIdContext } from "../components/peerIdContext";
import ConfirmModal from "../utils/confirmModal";
import { FaShareAlt } from "react-icons/fa"; 

/**
 * This component allows users to share their Peer ID or a direct chat link with others.
 * It uses the `PeerIdContext` to get the current user's Peer ID.
 * Users can copy their Peer ID or share it via the Web Share API (if supported by the browser).
 */

export default function Invitation({ close }) {
    const { peerId } = useContext(PeerIdContext);
    const [link, setLink] = useState("");

    // Share link using the Web Share API (if supported)
    const shareLink = async (title, url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `${title} - ${url}`,
                    url: url,
                });
                console.log("Link shared successfully");
            } catch (error) {
                console.error("Error sharing link:", error);
            }
        } else {
            console.warn("Web Share API is not supported in this browser");
        }
    };

    // Set the shareable link when the component mounts or peerId changes
    useEffect(() => {
        const l = `${window.location.origin}/chat/${peerId}`;
        setLink(l);
    }, [peerId]);

        // Share the Peer ID directly
    const handleSharePeerId = () => {
        const message = `Join me on WhisperSend! My Peer ID is: ${peerId}`;
        shareLink("My Peer ID", message);
    };

    // Copy the Peer ID to clipboard
    const handleCopyPeerId = () => {
        navigator.clipboard.writeText(peerId).then(() => {
            alert("Peer ID copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <ConfirmModal
                title={
                <div className="text-center">
                    Invitation by peer Id
                </div>
                }
                message={
                <Fragment>
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={close}
                    >
                        &#x2715; 
                    </button>
                    <div className="text-xs font-bold mb-2 text-center mt-2">
                        My Peer ID:
                    </div> 
                    <div className="mt-4">                        
                        <div className="flex justify-center items-center space-x-2">
                            <span
                                className="text-xs font-mono bg-gray-200 p-1 rounded-lg cursor-pointer"
                                onClick={handleCopyPeerId} 
                            >
                                {peerId}
                            </span>
                        </div>
                        <div className="text-xs mt-2 text-center">
                        Click to copy and share this link with your contact to
                        start a secure chat.
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
                navigator.clipboard.writeText(link);
                alert("Link copied to clipboard!");
                close(); 
            }}
            onCancel={close} 
        />
    );
}
