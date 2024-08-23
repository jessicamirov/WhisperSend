import { useContext } from "preact/hooks";
import { PeerIdContext } from "./peerIdContext";

export default function ChatMessages() {
    const { messages, peerId } = useContext(PeerIdContext);

    const handleDownload = (msg) => {
        console.log("URL received:", msg.url); // הדפסת ה-URL שהתקבל
        const link = document.createElement("a");
        link.href = msg.url; // השתמש ב-URL של הקובץ המוצפן
        link.download = msg.content; // שם הקובץ להורדה
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                                        <button
                                            onClick={() => handleDownload(msg)}
                                            className="ml-2 bg-green-500 text-white py-1 px-2 rounded"
                                        >
                                            Download
                                        </button>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
