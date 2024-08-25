import { Buffer } from "buffer"
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
} from "./encryption"
import { toast } from "react-toastify"

/**
 * Handles sending a text message in the chat.
 * Encrypts the message and updates the state with the new message.
 *
 * @param {Object} state - The current state of the application.
 * @param {Function} dispatch - The dispatch function to update the state.
 */
export const handleSendMessage = (state, dispatch) => {
    const { message, connection, recipientPeerId, messages, myWallet, peerId } =
        state

    if (!message || !connection || !myWallet || !peerId || !recipientPeerId) {
        console.error("Missing required data to send the message.", {
            message,
            connection,
            recipientPeerId,
            myWallet,
            peerId,
        })
        return
    }

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

    dispatch({
        type: "SET_MESSAGES",
        payload: [
            ...messages,
            { sender: peerId, content: message, type: "text", isMine: true },
        ],
    })

    dispatch({ type: "SET_MESSAGE", payload: "" })
}

/**
 * Handles sending a file in the chat.
 * Encrypts the file if the user chooses to, and updates the state with the file details.
 *
 * @param {Object} e - The event object from the file input.
 * @param {Object} state - The current state of the application.
 * @param {Function} dispatch - The dispatch function to update the state.
 */
export const handleSendFile = (e, state, dispatch) => {
    const { connection, recipientPeerId, myWallet, peerId, messages } = state

    if (!connection || !myWallet || !peerId || !recipientPeerId) {
        console.error("Cannot send file. Missing required data.")
        return
    }

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
                ? `encrypted-${new Date().getTime()}-${selectedFile.name}`
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

            dispatch({
                type: "SET_MESSAGES",
                payload: [
                    ...messages,
                    {
                        sender: peerId,
                        content: fileName,
                        type: "file",
                        url: fileURL,
                        encrypted: confirmEncrypt,
                    },
                ],
            })

            e.target.value = null // Reset the file input
        }
        reader.readAsArrayBuffer(selectedFile)
    } else {
        console.error("No file selected.")
    }
}

/**
 * Handles receiving a text message in the chat.
 * Decrypts the message and updates the state with the new message.
 *
 * @param {Function} setMessages - The function to update the messages state.
 * @param {string} privateKey - The private key of the recipient.
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
    } else {
        console.error("Failed to decrypt message", {
            data,
            recipientPeerId,
            privateKey,
        })
    }
}

/**
 * Handles receiving a file in the chat.
 * Decrypts the file if needed, generates a URL for the file, and updates the state with the file details.
 *
 * @param {Array} messages - The current list of messages.
 * @param {Function} setMessages - The function to update the messages state.
 * @param {string} privateKey - The private key of the recipient.
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

/**
 * Plays a sound when a message is sent.
 */
export const playSendSound = () => {
    const audio = new Audio("/assets/whisper.mp3")
    audio.play()
}
