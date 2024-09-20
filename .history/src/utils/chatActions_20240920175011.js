import { toast } from "react-toastify"
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
} from "./encryption"
import { Buffer } from "buffer"

let encryptFileCounter = 1
let globalMessageCount = 0

const sendSound = "/assets/whisper.mp3"

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

    // בדיקה אם הקובץ אינו מוצפן
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
        // פענוח המידע המוצפן
        const parsedData = JSON.parse(data.data);
        const { nonce, encrypted: encryptedData, fileType } = parsedData;

        const fileBuffer = Buffer.from(encryptedData, "hex");
        const fileTypeFinal = fileType || "application/octet-stream"; // שימוש בסוג ברירת מחדל אם אין סוג קובץ
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], {
                type: fileTypeFinal,
            })
        );
        encrypted = true;
        toast.success("Encrypted file received!");

        // שאלה אם לפענח את הקובץ
        const shouldDecrypt = await openConfirmModal(
            "Decrypt File",
            "Do you want to decrypt the received file?"
        );

        if (!shouldDecrypt) {
            const jsonContent = JSON.stringify(
                {
                    nonce,
                    encrypted: encryptedData,
                    fileType: fileTypeFinal, // שמירת סוג הקובץ בקובץ המוצפן
                },
                null,
                2
            );

            const blob = new Blob([jsonContent], {
                type: "application/json",
            });

            // שמירה בשם ייחודי עם סיומת json
            fileURL = URL.createObjectURL(blob);
            fileName = `encrypted${globalMessageCount}.json`; // קובץ מוצפן תמיד יורד כ-json עם מידע על סוג הקובץ
            toast.success("Encrypted file saved as JSON with fileType.");
        } else {
            // שימוש בפונקציה decryptFile לפענוח הקובץ
            const decryptedBlob = decryptFile(
                JSON.stringify(parsedData),
                senderPublicKey,
                privateKey
            );
            const newBlob= new Blob([Buffer.from(decrypted)], {
                type: fileType,
            })
            if (decryptedBlob) {
                // יצירת שם קובץ מפוענח עם סיומת נכונה
                fileName = `decrypted${globalMessageCount}.${fileTypeFinal.split("/").pop()}`;

                fileURL = URL.createObjectURL(newBlob);
                toast.success("File decrypted!");
            } else {
                console.error("File decryption failed.");
                return;
            }
        }
    }

    // הוספת הקובץ המפוענח למערכת ההודעות
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

