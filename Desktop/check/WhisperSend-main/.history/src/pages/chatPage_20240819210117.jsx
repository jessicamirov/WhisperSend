import { useContext, useState, useEffect } from "preact/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatInstruction from "../components/chatInstruction";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import DecryptModal from "../components/DecryptModal";
import { PeerIdContext } from "../components/peerIdContext";

export default function ChatPage({ connectPeerId }) {
    const { setOpenDecryptModal } = useContext(PeerIdContext); // הוספה של openDecryptModal לקונטקסט
    const [isDecryptModalOpen, setDecryptModalOpen] = useState(false);
    const [decryptCallback, setDecryptCallback] = useState(null);

    const openDecryptModal = (onConfirm) => {
        setDecryptCallback(() => () => {
            onConfirm();
            setDecryptModalOpen(false);
        });
        setDecryptModalOpen(true);
    };

    useEffect(() => {
        setOpenDecryptModal(openDecryptModal); // העברה של הפונקציה ל-PeerIdContext
    }, [setOpenDecryptModal]);

    return (
        <ChatLayout connectPeerId={connectPeerId}>
            <div className="flex">
                <ChatInstruction />
                <div className="w-3/4 pl-4">
                    <ChatMessages />
                    <MessageInput />
                </div>
            </div>
            <ToastContainer />
            {isDecryptModalOpen && (
                <DecryptModal
                    onConfirm={decryptCallback}
                    onCancel={() => setDecryptModalOpen(false)}
                />
            )}
        </ChatLayout>
    );
}
