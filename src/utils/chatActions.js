import { toast } from "react-toastify"
import sendSound from "../assets/whisper.mp3"
import { Buffer } from "buffer"

//handle all traffic into the chat page

let encryptFileCounter = 1 // Counter for encrypted files

export const playSendSound = () => {
    const audio = new Audio(sendSound)
    audio.play()
}

export const handleSendMessage = ({
    message,
    connection,
    encryptText,
    recipientPeerId,
    messages,
    myWallet,
    peerId,
    setMessages,
    setMessage,
}) => {
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

export const handleSendFile = async ({
    e,
    connection,
    encryptFile,
    recipientPeerId,
    myWallet,
    peerId,
    setMessages,
    messages,
}) => {
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
