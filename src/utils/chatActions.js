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
let globalMessageCount = 0

export const playSendSound = () => {
    const audio = new Audio(sendSound)
    audio.play()
}

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
        const { encrypted, nonce } = encryptText(
            message,
            recipientPeerId,
            myWallet.privateKey,
        )

        // בדיקה אם ההצפנה נכשלה
        if (!encrypted || !nonce) {
            console.error("Encryption failed, cannot send message.")
            return
        }

        const encMessage = JSON.stringify({
            messageType: "text",
            encrypted,
            nonce,
        })

        connection.send(encMessage)
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
                // קובץ מוצפן, שמירת סוג הקובץ כחלק מה- nonce
                const encryptedFileData = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey,
                )
                encMessage = JSON.stringify({
                    nonce: encryptedFileData.nonce,
                    encrypted: encryptedFileData.encrypted,
                    fileType: selectedFile.type, // שמירת סוג הקובץ
                })
                fileName = `encrypted${encryptFileCounter++}.txt` // הקובץ המוצפן תמיד יהיה .txt
            } else {
                // קובץ לא מוצפן שומר על הסיומת המקורית
                encMessage = fileBuffer.toString("hex")
                fileName = selectedFile.name // שימוש בשם והסיומת המקוריים
            }

            // שליחת הקובץ
            connection.send(
                JSON.stringify({
                    messageType: "file",
                    data: encMessage,
                    fileName,
                }),
            )

            // יצירת URL עבור הקובץ שנשלח לשולח עצמו (הקובץ המקורי אם הוא לא מוצפן)
            const fileURL = URL.createObjectURL(
                new Blob([confirmEncrypt ? encMessage : event.target.result], {
                    type: selectedFile.type,
                }),
            )

            // הצגת שם הקובץ בצ'אט
            const displayName = confirmEncrypt
                ? fileName // קובץ מוצפן תמיד יקבל שם בפורמט encryptedX.txt
                : fileName // קובץ לא מוצפן שומר על שמו המקורי

            // עדכון הודעות עם הקובץ שנשלח
            setMessages([
                ...messages,
                {
                    sender: peerId,
                    content: displayName,
                    type: "file",
                    url: fileURL,
                    encrypted: confirmEncrypt,
                },
            ])
        }
        reader.readAsArrayBuffer(selectedFile)

        // איפוס בחירת הקובץ לאחר השליחה
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
    let fileURL
    let fileName = data.fileName
    let encrypted = false

    globalMessageCount++ // העלאת המספר הסידורי עבור כל הודעה חדשה

    if (!fileName) {
        console.error("Received file without a valid name.")
        return
    }

    // בדיקה אם הקובץ נשלח כקובץ מוצפן או לא מוצפן
    if (
        typeof data.data === "string" &&
        data.data.length % 2 === 0 &&
        /^[0-9a-f]+$/i.test(data.data)
    ) {
        // קובץ לא מוצפן, שמירה כקובץ כפי שהוא
        const fileBuffer = Buffer.from(data.data, "hex")
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream",
        })
        fileURL = URL.createObjectURL(blob)
        fileName = `${fileName}` // שימוש במספר סידורי ייחודי
        toast.success("Unencrypted file received!")
    } else {
        // קובץ מוצפן עם nonce
        const parsedData = JSON.parse(data.data)
        const { nonce, encrypted: encryptedData, fileType } = parsedData

        const fileBuffer = Buffer.from(encryptedData, "hex")
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], {
                type: "application/octet-stream",
            }),
        )
        encrypted = true
        toast.success("Encrypted file received!")

        const shouldDecrypt = await openConfirmModal(
            "Decrypt File",
            "Do you want to decrypt the received file?",
        )

        if (!shouldDecrypt) {
            const jsonContent = JSON.stringify(
                {
                    nonce,
                    encrypted: encryptedData,
                },
                null,
                2,
            )
            const blob = new Blob([jsonContent], {
                type: "application/json",
            })
            fileURL = URL.createObjectURL(blob)
            fileName = `encrypted${globalMessageCount}.txt` // שימוש במספר סידורי ייחודי עבור קובץ מוצפן
            toast.success("Encrypted file saved as JSON with nonce.")
        } else {
            const decryptedBlob = decryptFile(
                data.data,
                senderPublicKey,
                privateKey,
            )
            if (decryptedBlob) {
                fileURL = URL.createObjectURL(decryptedBlob)
                fileName = `decrypted${globalMessageCount}.${fileType.split("/").pop()}` // שימוש בסיומת מתוך fileType ושם ייחודי
                toast.success("File decrypted!")
            } else {
                console.error("File decryption failed.")
                return
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
    ])
}
