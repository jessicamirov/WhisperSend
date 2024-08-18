import { toast } from "react-toastify"
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
} from "./encryption"
import sendSound from "../assets/whisper.mp3"
import { Buffer } from "buffer"

let encryptFileCounter = 1 

/**
 * Plays a sound when a message is sent.
 */
export const playSendSound = () => {
    const audio = new Audio(sendSound)
    audio.play()
}

/**
 * Handles sending a text message.
 * Encrypts the message, updates the message list, plays a send sound, and displays a success toast.
 *
 * @param {Object} params - The parameters for sending a message.
 * @param {string} params.message - The message text to send.
 * @param {Object} params.connection - The connection object to send the message through.
 * @param {string} params.recipientPeerId - The peer ID of the recipient.
 * @param {Array} params.messages - The current list of messages.
 * @param {Object} params.myWallet - The wallet object of the sender.
 * @param {string} params.peerId - The peer ID of the sender.
 * @param {Function} params.setMessages - The function to update the messages state.
 * @param {Function} params.setMessage - The function to update the message input state.
 */
export const handleSendMessage = ({
    message,
    connection,
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
            messageType: "text",
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

/**
 * Formats the current date and time into a string suitable for filenames.
 *
 * @returns {string} The formatted date string.
 */
const formatDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

/**
 * Handles sending a file.
 * Optionally encrypts the file, updates the message list with the file, and resets the file input.
 *
 * @param {Object} params - The parameters for sending a file.
 * @param {Event} params.e - The event triggered by selecting a file.
 * @param {Object} params.connection - The connection object to send the file through.
 * @param {string} params.recipientPeerId - The peer ID of the recipient.
 * @param {Object} params.myWallet - The wallet object of the sender.
 * @param {string} params.peerId - The peer ID of the sender.
 * @param {Function} params.setMessages - The function to update the messages state.
 * @param {Array} params.messages - The current list of messages.
 */
export const handleSendFile = async ({
    e,
    connection,
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
            let fileName = confirmEncrypt
                ? `encrypted${encryptFileCounter++}-${formatDate()}${selectedFile.name.substring(selectedFile.name.lastIndexOf("."))}`
                : selectedFile.name

            if (confirmEncrypt) {
                encMessage = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey,
                )
            } else {
                encMessage = fileBuffer.toString("hex")
            }

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
            e.target.value = null
        }
        reader.readAsArrayBuffer(selectedFile)
    }
}

/**
 * Handles receiving a text message.
 * Decrypts the message and updates the message list.
 *
 * @param {Function} setMessages - The function to update the messages state.
 * @param {string} privateKey - The private key used for decryption.
 * @param {string} recipientPeerId - The peer ID of the sender.
 * @param {string} data - The encrypted message data.
 */
export const handleReceiveMessage = (
    setMessages,
    privateKey,
    recipientPeerId,
    data,
) => {
    const decryptedMessage = decryptText(data, recipientPeerId, privateKey)
    console.log("Decrypted message:", decryptedMessage)
    if (decryptedMessage !== "error") {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Peer", content: decryptedMessage, type: "text" },
        ])
    }
}

/**
 * Handles receiving a file.
 * Decrypts the file if needed, generates a URL for the file, and updates the message list.
 *
 * @param {Array} messages - The current list of messages.
 * @param {Function} setMessages - The function to update the messages state.
 * @param {string} privateKey - The private key used for decryption.
 * @param {string} recipientPeerId - The peer ID of the sender.
 * @param {Object} data - The encrypted file data.
 */
export const handleReceiveFile = (
    messages,
    setMessages,
    privateKey,
    recipientPeerId,
    data,
) => {
    console.log("handleReceiveFile called with:", data)
    let fileURL
    let fileName = data.fileName
    let encrypted = false

    if (!fileName) {
        console.error("Received file without a valid name.")
        return
    }

    if (
        typeof data.data === "string" &&
        data.data.length % 2 === 0 &&
        /^[0-9a-f]+$/i.test(data.data)
    ) {
        console.log("Processing unencrypted file:", fileName)
        const fileBuffer = Buffer.from(data.data, "hex")
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream",
        })
        fileURL = URL.createObjectURL(blob)
        toast.success("File received!")
    } else {
        console.log("Processing encrypted file:", fileName)
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

        if (document.visibilityState === "visible") {
            const confirmDecrypt = window.confirm(
                "Do you want to decrypt the file?",
            )
            if (confirmDecrypt) {
                console.log("User chose to decrypt the file:", fileName)
                const decryptedFileURL = decryptFile(
                    data.data,
                    recipientPeerId,
                    privateKey,
                )
                if (decryptedFileURL) {
                    fileURL = decryptedFileURL
                    fileName = fileName.replace("encrypted", "decrypted")
                    toast.success("File decrypted!")
                } else {
                    console.error("File decryption failed.")
                    return
                }
            }
        } else {
            console.warn("Page is not visible; skipping window.confirm()")
        }
    }

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
