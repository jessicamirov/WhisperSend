import { toast } from "react-toastify"
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
} from "./encryption"
import { Buffer } from "buffer"

let encryptFileCounter = 1// Counter to track encrypted files sent.
let globalMessageCount = 0// Counter for total messages sent.


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
 * - Encrypts the message using the recipient's peer ID and the sender's private key.
 * - Sends the encrypted message to the recipient through the established connection.
 * - Updates the message list after sending.
 * - Plays a sound and shows a toast notification when the message is sent successfully.
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
        console.log("recipientPeerId:::")
        console.log(recipientPeerId)
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
 * Handles sending a file through the peer-to-peer connection, with an option to encrypt the file.
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

export const handleReceiveFile = async (
    messages,
    setMessages,
    privateKey,
    senderPublicKey,
    data,
    openConfirmModal,
) => {
    let fileURL;
    let fileName = data.fileName;
    let encrypted = false;

    globalMessageCount++;

    if (!fileName) {
        console.error("Received file without a valid name.");
        return;
    }

    if (
        typeof data.data === "string" &&
        data.data.length % 2 === 0 &&
        /^[0-9a-f]+$/i.test(data.data)
    ) {
        const fileBuffer = Buffer.from(data.data, "hex");
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream",
        });
        fileURL = URL.createObjectURL(blob);
        fileName = `${fileName}`;
        toast.success("Unencrypted file received!");
    } else {
        const parsedData = JSON.parse(data.data);
        const { nonce, encrypted: encryptedData, fileType } = parsedData;

        const fileBuffer = Buffer.from(encryptedData, "hex");
        const fileTypeFinal = fileType || "application/octet-stream"; 
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], {
                type: fileTypeFinal,
            })
        );
        encrypted = true;
        toast.success("Encrypted file received!");

        const shouldDecrypt = await openConfirmModal(
            "Decrypt File",
            "Do you want to decrypt the received file?"
        );

        if (!shouldDecrypt) {
            const jsonContent = JSON.stringify(
                {
                    nonce,
                    encrypted: encryptedData,
                    fileType: fileTypeFinal, 
                },
                null,
                2
            );

            const blob = new Blob([jsonContent], {
                type: "application/json",
            });

            fileURL = URL.createObjectURL(blob);
            fileName = `encrypted${globalMessageCount}.json`; 
            toast.success("Encrypted file saved as JSON with fileType.");
        } else {

            const decryptedBlob = decryptFile(
                JSON.stringify(parsedData),
                senderPublicKey,
                privateKey
            );

            if (decryptedBlob) {

                const blob = new Blob([decryptedBlob], {
                    type: fileTypeFinal || "application/octet-stream", 
                });

                fileName = `decrypted${globalMessageCount}`;
 
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `decrypted${globalMessageCount}`;
                link.click();

                toast.success("File decrypted and saved!");
            } else {
                console.error("File decryption failed.");
                return;
            }
        }
    }


    setMessages((prevMessages) => [
        ...prevMessages,
        {
            sender: "Peer",
            content: fileName,
            type: "file",
            url: fileURL,
            encrypted,
        },
    ]);
};

