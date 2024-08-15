import { useState, useContext, useEffect } from "preact/hooks"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import sendSound from "../assets/whisper.mp3"
import { PeerIdContext } from "../components/peerIdContext"
import ChatInstruction from "../components/chatInstruction"
import ChatLayout from "../components/chatLayout"
import ChatMessages from "../components/chatMessages"
import MessageInput from "../components/messageInput"
import { Buffer } from "buffer"

let encryptFileCounter = 1 // Counter for encrypted files

//handle all traffic into the chat page

export default function ChatPage({ connectPeerId }) {
    const {
        connection,
        messages,
        setMessages,
        message,
        setMessage,
        myWallet,
        encryptText,
        encryptFile,
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
            const encMessage = JSON.stringify({
                messageType: "text", // הוספת מזהה עבור הודעת טקסט
                encrypted,
                nonce,
            })
            console.log("Sending message:", encMessage)
            connection.send(encMessage)
            setMessages([
                ...messages,
                { sender: peerId, content: message, type: "text" },
            ])
            setMessage("")
            playSendSound()
            toast.success("Message sent!")
        }
    }

    const handleSendFile = async (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            const confirmEncrypt = window.confirm(
                "Do you want to encrypt the file before sending?",
            )
            const reader = new FileReader()
            reader.onload = async (event) => {
                const fileBuffer = Buffer.from(event.target.result)
                let encMessage
                let fileName = selectedFile.name
                if (confirmEncrypt) {
                    fileName = `encrypted${encryptFileCounter++}${fileName.substring(fileName.lastIndexOf("."))}`
                    encMessage = encryptFile(
                        fileBuffer,
                        recipientPeerId,
                        myWallet.privateKey,
                    )
                } else {
                    encMessage = fileBuffer.toString("hex")
                }

                // הוספת מזהה עבור קובץ
                connection.send(
                    JSON.stringify({
                        messageType: "file",
                        data: encMessage,
                        fileName: fileName,
                    }),
                )

                const fileURL = URL.createObjectURL(
                    new Blob([fileBuffer], {
                        type: "application/octet-stream",
                    }),
                )
                setMessages([
                    ...messages,
                    {
                        sender: peerId,
                        content: fileName,
                        type: "file",
                        url: fileURL,
                        encrypted: confirmEncrypt,
                    },
                ])
            }
            reader.readAsArrayBuffer(selectedFile)
        }
    }

    return (
        <ChatLayout peerId={peerId} connectPeerId={connectPeerId}>
            <div className="flex">
                <ChatInstruction />
                <div className="w-3/4 pl-4">
                    <ChatMessages messages={messages} peerId={peerId} />
                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        handleSendMessage={handleSendMessage}
                        handleFileChange={handleSendFile}
                    />
                </div>
            </div>
            <ToastContainer />
        </ChatLayout>
    )
}
