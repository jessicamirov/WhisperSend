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
        encryptFile,
        decryptFile,
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

    const handleReceiveMessage = (data) => {
        console.log("Received message:", data)
        const decryptedMessage = decryptText(
            data,
            recipientPeerId,
            myWallet.privateKey,
        )
        console.log("Decrypted message:", decryptedMessage)
        if (decryptedMessage !== "error") {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "Peer", content: decryptedMessage, type: "text" },
            ])
            playSendSound()
        }
    }

   const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        const confirmEncrypt = window.confirm("Do you want to encrypt the file before sending?");
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileBuffer = Buffer.from(event.target.result);
            let encMessage;
            let fileName = selectedFile.name;
            if (confirmEncrypt) {
                fileName = `encrypted${encryptFileCounter++}${fileName.substring(fileName.lastIndexOf('.'))}`;
                encMessage = encryptFile(fileBuffer, recipientPeerId, myWallet.privateKey);
            } else {
                encMessage = fileBuffer.toString('hex');
            }

            // הוספת מזהה עבור קובץ
            connection.send(JSON.stringify({
                messageType: "file",
                data: encMessage,
                fileName: fileName,
            }));

            const fileURL = URL.createObjectURL(new Blob([fileBuffer], { type: "application/octet-stream" }));
            setMessages([...messages, { sender: peerId, content: fileName, type: "file", url: fileURL, encrypted: confirmEncrypt }]);
        };
        reader.readAsArrayBuffer(selectedFile);
    }
};


    const handleReceiveFile = (data) => {
        console.log("Received file:", data)
        let fileURL
        let fileName = data.fileName || `received_file_${Date.now()}`
        let encrypted = false

        // בדיקה אם הקובץ מוצפן או לא
        if (
            typeof data.data === "string" &&
            data.data.length % 2 === 0 &&
            /^[0-9a-f]+$/i.test(data.data)
        ) {
            // הקובץ לא מוצפן, שולח כ-Hex
            const fileBuffer = Buffer.from(data.data, "hex")
            const blob = new Blob([fileBuffer], {
                type: "application/octet-stream",
            })
            fileURL = URL.createObjectURL(blob)
            toast.success("File received!")
        } else {
            // הקובץ מוצפן
            const parsedData = JSON.parse(data.data)
            const { nonce, encrypted: encryptedData } = parsedData

            if (!nonce || !encryptedData) {
                console.error(
                    "Invalid nonce or encrypted data:",
                    nonce,
                    encryptedData,
                )
                return
            }

            const fileBuffer = Buffer.from(encryptedData, "hex")
            fileURL = URL.createObjectURL(
                new Blob([fileBuffer], { type: "application/octet-stream" }),
            )
            encrypted = true
            toast.success("Encrypted file received!")

            // מניעה של קריאה כפולה לפענוח
            const confirmDecrypt = window.confirm(
                "Do you want to decrypt the file?",
            )
            if (confirmDecrypt) {
                const decryptedFileURL = decryptFile(
                    data.data,
                    recipientPeerId,
                    myWallet.privateKey,
                )
                if (decryptedFileURL) {
                    fileURL = decryptedFileURL
                    fileName = fileName.replace("encrypted", "decrypted") // שינוי שם הקובץ המפוענח
                    toast.success("File decrypted!")
                } else {
                    toast.error("File decryption failed.")
                    return // לא מוסיף את הקובץ אם הפענוח נכשל
                }
            } else {
                // אם המשתמש בוחר לא לפענח, נשאיר את שם הקובץ כמו שהוא
                fileName = data.fileName
            }
        }

        // ודא שהקובץ לא נוסף פעמיים לרשימת ההודעות
        const fileAlreadyExists = messages.some(
            (msg) => msg.content === fileName && msg.type === "file",
        )
        if (!fileAlreadyExists) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: "Peer",
                    content: fileName,
                    type: "file",
                    url: fileURL,
                    encrypted: encrypted,
                },
            ])
        }
    }

    useEffect(() => {
        if (connection) {
            connection.on("data", (data) => {
                try {
                    const parsedData = JSON.parse(data)
                    if (parsedData.type === "file") {
                        handleReceiveFile(parsedData)
                    } else {
                        handleReceiveMessage(data)
                    }
                } catch (error) {
                    handleReceiveMessage(data)
                }
            })
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
