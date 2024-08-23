import { useState } from 'preact/hooks';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatInstruction from "../components/chatInstruction";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import DecryptModal from "../components/DecryptModal"; // ייבוא המודל

export default function ChatPage({ connectPeerId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [decryptCallback, setDecryptCallback] = useState(null);

    const handleOpenModal = (callback) => {
        setDecryptCallback(() => callback);
        setIsModalOpen(true);
    };

    const handleConfirmDecrypt = () => {
        if (decryptCallback) decryptCallback();
        setIsModalOpen(false);
    };

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
            <DecryptModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleConfirmDecrypt} 
            />
        </ChatLayout>
    );
}
