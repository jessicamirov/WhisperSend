import { useState, useContext, useEffect, useRef } from "preact/hooks";
import {
    FaSyncAlt,
    FaShareAlt,
    FaEye,
    FaEyeSlash,
    FaCopy,
} from "react-icons/fa";
import { PeerIdContext } from "../components/peerIdContext";

/**
 * Displays the user Peer ID, with functionality to copy it to the clipboard.
 * Allows the user to expand or collapse the Peer ID display on small screens.
 * Allows recalculating the Peer ID, copying the Peer ID, and inviting others to connect.
 */
export default function PeerIdDisplay({
    handleInvite,
    handleCopyPeerId,
    customStyle,
    showIcons,
}) {
    const { peerId, recalculatePeerId } = useContext(PeerIdContext);
    const [isExpanded, setIsExpanded] = useState(false);// State to control expanded view on small screens
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const textRef = useRef(null); // Reference for the peerId text element for dragging

    // Toggles the expanded/collapsed state of the Peer ID display
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Handles screen resizing, determining if it's a small screen and setting the expanded state accordingly
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsExpanded(true);
            } else {
                setIsExpanded(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Mouse dragging functions for dragging the Peer ID left or right when displayed in long format
    const handleMouseDown = (e) => {
        const textElement = textRef.current;
        textElement.dataset.isDragging = "true";
        textElement.dataset.startX = e.pageX - textElement.scrollLeft;
    };

    const handleMouseMove = (e) => {
        const textElement = textRef.current;
        if (textElement.dataset.isDragging === "true") {
            textElement.scrollLeft = e.pageX - textElement.dataset.startX;
        }
    };

    const handleMouseUp = () => {
        const textElement = textRef.current;
        textElement.dataset.isDragging = "false";
    };

    //Copy the peerId to clipboard when clicked
    const handleCopyPeerIdClick = () => {
        navigator.clipboard.writeText(peerId)
            .then(() => {
                alert("Peer ID copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy Peer ID: ", err);
            });
    };

    return (
        <div className={`flex flex-col items-center mb-4 ${customStyle}`}>
            <div className="flex items-center space-x-2 mb-4">
                <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    My Peer ID
                </p>
            </div>
            <div className="flex items-center justify-between bg-gray-700 text-white px-2 py-1 rounded-lg w-full max-w-full">
                {(isExpanded || !isSmallScreen) && (
                    <div
                        ref={textRef}
                        className="flex-1 overflow-hidden whitespace-nowrap mr-2 cursor-pointer" // cursor-pointer to indicate it's clickable
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onClick={handleCopyPeerIdClick} 
                    >
                        <span className="text-sm font-bold">{peerId}</span>
                    </div>
                )}

                {isSmallScreen && isExpanded && (
                    <button
                        onClick={toggleExpand}
                        className="focus:outline-none flex items-center space-x-1"
                    >
                        <FaEyeSlash />
                        <span>Hide</span>
                    </button>
                )}

                {isSmallScreen && !isExpanded && (
                    <div className="flex items-center w-full">
                        <button
                            onClick={toggleExpand}
                            className="focus:outline-none flex items-center space-x-1 ml-auto"
                        >
                            <FaEye />
                            <span>Show</span>
                        </button>

                        {showIcons && (
                            <div className="flex items-center space-x-2 ml-auto">
                                <button
                                    className="focus:outline-none"
                                    onClick={recalculatePeerId}
                                >
                                    <FaSyncAlt className="w-4 h-4 text-yellow-500 cursor-pointer" />
                                </button>
                                <button
                                    className="focus:outline-none"
                                    onClick={handleCopyPeerId}
                                >
                                    <FaCopy className="w-4 h-4 text-white cursor-pointer" />
                                </button>
                                <button
                                    className="focus:outline-none"
                                    onClick={handleInvite}
                                >
                                    <FaShareAlt className="w-4 h-4 text-white cursor-pointer" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!isSmallScreen && showIcons && (
                    <div className="flex items-center space-x-4">
                        {" "}
                        <button
                            className="focus:outline-none"
                            onClick={recalculatePeerId}
                        >
                            <FaSyncAlt className="w-4 h-4 text-yellow-500 cursor-pointer" />
                        </button>
                        <button
                            className="focus:outline-none"
                            onClick={handleCopyPeerId}
                        >
                            <FaCopy className="w-4 h-4 text-white cursor-pointer" />
                        </button>
                        <button
                            className="focus:outline-none"
                            onClick={handleInvite}
                        >
                            <FaShareAlt className="w-4 h-4 text-white cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
