import { useState, useContext, useEffect } from "preact/hooks"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import sendSound from "../assets/whisper.mp3"
import { PeerIdContext } from "../components/peerIdContext" // עדכון הייבוא
import ChatInstruction from "../components/chatInstruction"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"

export default function ChatPage({ connectPeerId }) {
    const {
        peer,
        connectToPeer,
        disconnect,
        connection,
        recipient,
        setRecipient,
        messages,
        setMessages,
        message,
        setMessage,
        myWallet,
        encryptText,
        decryptText,
        peerId,
        recipientPeerId,
    } = useContext(PeerIdContext)

    const playSendSound = () => {
        const audio = new Audio(sendSound)
        audio.play()
    }

    const handleSendMessage = () => {
        if (message.trim() && connection) {
            const { encrypted, nonce } = encryptText(
                message,
                recipientPeerId,
                myWallet.privateKey,
            )
            const encMessage = JSON.stringify({ encrypted, nonce })
            console.log("Sending message:", encMessage) // Log the encrypted message
            setMessages([
                ...messages,
                { sender: peerId, content: message, type: "text" },
            ]) // עדכון מבנה ההודעה
            setMessage("")
            playSendSound()
            toast.success("Message sent!")
            connection.send(encMessage)
        }
    }

    const handleReceiveMessage = (data) => {
        console.log("Received message:", data) // Log the received data
        const decryptedMessage = decryptText(
            data,
            recipientPeerId,
            myWallet.privateKey,
        )
        console.log("Decrypted message:", decryptedMessage) // Log the decrypted message
        if (decryptedMessage !== "error") {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "Peer", content: decryptedMessage, type: "text" },
            ]) // עדכון מבנה ההודעה
            playSendSound()
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            const confirmEncrypt = window.confirm(
                "Do you want to encrypt the file before sending?",
            )
            if (confirmEncrypt) {
                toast.info("File will be encrypted and sent.")
                // Add your file encryption logic here
            } else {
                toast.info("File will be sent without encryption.")
            }
        }
    }

    useEffect(() => {
        if (connection) {
            connection.on("data", handleReceiveMessage)
        }
    }, [connection])

    const connectRecipient = (e) => {
        e.preventDefault()
        if (connection) {
            disconnect()
        } else {
            connectToPeer(recipient)
        }
    }

    return (
        <ChatLayout peerId={peerId} connectPeerId={connectPeerId}>
            <div className="flex">
                <ChatInstruction />
                <div className="w-3/4 pl-4">
                    <ChatMessages messages={messages} peerId={peerId} />
                    <form onSubmit={connectRecipient}>
                        <div className="flex justify-start gap-2">
                            <input
                                type="text"
                                required
                                readOnly={connection}
                                className="bg-slate-500 w-full"
                                value={recipient}
                                onInput={(e) => setRecipient(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="border border-slate-500 hover:border-slate-300 py-1 px-2"
                            >
                                {connection ? "disconnect" : "connect"}
                            </button>
                        </div>
                    </form>
                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        handleSendMessage={handleSendMessage}
                        handleFileChange={handleFileChange}
                    />
                </div>
            </div>
            <ToastContainer />
        </ChatLayout>
    )
}
