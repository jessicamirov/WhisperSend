import { toast } from "react-toastify"
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
} from "./encryption"
import { Buffer } from "buffer"

let encryptFileCounter = 1 // Counter to track encrypted files sent.
let globalMessageCount = 0 // Counter for total messages sent.

/**
 * Plays a sound to indicate that a message or file has been sent successfully.
 */
const sendSound = "/assets/whisper.mp3"

export const playSendSound = () => {
    const audio = new Audio(sendSound)
    audio.play()
}

/**
 * Handles sending an encrypted text message through the peer-to-peer connection.
 * Encrypts the message using the recipient's peer ID and the sender's private key.
 * Sends the encrypted message to the recipient through the established connection.
 * Updates the message list after sending.
 * Plays a sound and shows a toast notification when the message is sent successfully.
 * */
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
    if (!message || !recipientPeerId || !myWallet || !myWallet.privateKey) {
        console.error("Missing parameters for encryption or sending message.")
        return
    }

    if (connection && connection.open) {
        // Encrypt the message using the recipient's peer ID and the sender's private key.
        const { encrypted, nonce } = encryptText(
            message,
            recipientPeerId,
            myWallet.privateKey,
        )

        if (!encrypted || !nonce) {
            console.error("Encryption failed, cannot send message.")
            return
        }
        // Prepare the message for sending.

        const encMessage = JSON.stringify({
            messageType: "text",
            encrypted,
            nonce,
        })
        // Send the encrypted message.

        connection.send(encMessage)
        // Update the message list with the new message.

        setMessages([
            ...messages,
            { sender: peerId, content: message, type: "text" },
        ])
        setMessage("")
        playSendSound()
        toast.success("Message sent!")
    } else {
        console.error("Connection is not open, cannot send message.")
    }
}
/**
 * Handles sending a file through the peer-to-peer connection.
 * The user can choose whether to encrypt the file before sending.
 * If encrypted, the file is sent as a JSON with encryption details (nonce and encrypted data).
 * If not encrypted, the file sent as it is.
 * The file is displayed in the message list with a URL link for download.
 */
export const handleSendFile = async ({
    e,
    connection,
    recipientPeerId,
    myWallet,
    peerId,
    setMessages,
    messages,
    openConfirmModal,
}) => {
    const selectedFile = e.target.files[0]
    // Ask the user if they want to encrypt the file before sending.
    if (selectedFile) {
        const confirmEncrypt = await openConfirmModal(
            "Encrypt File",
            "Do you want to encrypt the file before sending?",
        )

        const reader = new FileReader()
        reader.onload = async (event) => {
            const fileBuffer = Buffer.from(event.target.result)
            let encMessage
            let fileName
            // Encrypt the file data.

            if (confirmEncrypt) {
                const encryptedFileData = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey,
                )
                encMessage = JSON.stringify({
                    nonce: encryptedFileData.nonce,
                    encrypted: encryptedFileData.encrypted,
                    fileType: selectedFile.type,
                })
                fileName = `encrypted${encryptFileCounter++}.json`
            } else {
                // Send the file without encryption as a hex string.
                encMessage = fileBuffer.toString("hex")
                fileName = selectedFile.name
            }

            connection.send(
                JSON.stringify({
                    messageType: "file",
                    data: encMessage,
                    fileName,
                }),
            )
            // Create a URL for downloading the file and update the message list.
            const fileURL = URL.createObjectURL(
                new Blob([confirmEncrypt ? encMessage : event.target.result], {
                    type: selectedFile.type,
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

        e.target.value = null
    }
}
/**
 * Handles receiving an encrypted text message from a peer.
 * Decrypts the message using the recipient's private key and the sender's public key.
 * Adds the decrypted message to the message list.
 */
export const handleReceiveMessage = (
    setMessages,
    privateKey,
    senderPublicKey,
    data,
) => {
    const decryptedMessage = decryptText(data, senderPublicKey, privateKey)
    if (decryptedMessage !== "error") {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Peer", content: decryptedMessage, type: "text" },
        ])
    } else {
        console.error("Failed to decrypt message.")
    }
}
/**
 * Handles receiving a file from a peer, with the option to decrypt it.
 * The user can choose whether to decrypt the received file.
 * If decrypted, the file is saved with a decrypted file name.
 * If not decrypted, the file is saved as a JSON containing the encrypted data and encryption details.
 * Adds the file to the message list with a download link.
 */
export const handleReceiveFile = async (
    messages,
    setMessages,
    privateKey,
    senderPublicKey,
    data,
    openConfirmModal,
) => {
    let fileURL
    let fileName = data.fileName
    let encrypted = false

    globalMessageCount++

    if (!fileName) {
        console.error("Received file without a valid name.")
        return
    }
    // Check if the file is encrypted or not.
    if (
        typeof data.data === "string" &&
        data.data.length % 2 === 0 &&
        /^[0-9a-f]+$/i.test(data.data)
    ) {
        // If the file is not encrypted, convert it from hex to binary and display it.
        const fileBuffer = Buffer.from(data.data, "hex")
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream",
        })
        fileURL = URL.createObjectURL(blob)
        fileName = `${fileName}`
        toast.success("Unencrypted file received!")
    } else {
        // If the file is encrypted, handle the decryption process.
        const parsedData = JSON.parse(data.data)
        const { nonce, encrypted: encryptedData, fileType } = parsedData

        const fileBuffer = Buffer.from(encryptedData, "hex")
        const fileTypeFinal = fileType || "application/octet-stream"
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], {
                type: fileTypeFinal,
            }),
        )
        encrypted = true
        toast.success("Encrypted file received!")
        // Ask the user if they want to decrypt the file.
        const shouldDecrypt = await openConfirmModal(
            "Decrypt File",
            "Do you want to decrypt the received file?",
        )

        if (!shouldDecrypt) {
            const savePeerId = await openConfirmModal(
                "Save your partner's peer ID for future decryption",
                "Peer Id: "+`${senderPublicKey}`,
            )
            // Save the encrypted file as a JSON containing the encryption details.
            const jsonContent = JSON.stringify(
                {
                    nonce,
                    encrypted: encryptedData,
                    fileType: fileTypeFinal,
                },
                null,
                2,
            )

            const blob = new Blob([jsonContent], {
                type: "application/json",
            })

            fileURL = URL.createObjectURL(blob)
            fileName = `encrypted${globalMessageCount}.json`
            toast.success("Encrypted file saved as JSON with fileType.")
        } else {
            // Decrypt the file and save it with a decrypted file name.
            const decryptedBlob = decryptFile(
                JSON.stringify(parsedData),
                senderPublicKey,
                privateKey,
            )

            if (decryptedBlob) {
                const blob = new Blob([decryptedBlob], {
                    type: fileTypeFinal || "application/octet-stream",
                })

                fileName = `decrypted${globalMessageCount}`

                // Create a download link for the decrypted file.
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = `decrypted${globalMessageCount}`
                link.click()

                toast.success("File decrypted and saved!")
            } else {
                console.error("File decryption failed.")
                return
            }
        }
    }

    // Update the message list with the received file.
    setMessages((prevMessages) => [
        ...prevMessages,
        {
            sender: "Peer",
            content: fileName,
            type: "file",
            url: fileURL,
            encrypted,
        },
    ])
}
