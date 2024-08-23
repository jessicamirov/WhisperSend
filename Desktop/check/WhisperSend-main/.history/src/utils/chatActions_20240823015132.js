import { toast } from "react-toastify";
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile
} from "./encryption";
import sendSound from "../assets/whisper.mp3";
import { Buffer } from "buffer";

let encryptFileCounter = 1;

export const playSendSound = () => {
    const audio = new Audio(sendSound);
    audio.play();
};

export const handleSendMessage = ({
    message,
    connection,
    recipientPeerId,
    messages,
    myWallet,
    peerId,
    setMessages,
    setMessage
}) => {
    if (message.trim() && connection) {
        const { encrypted, nonce } = encryptText(
            message,
            recipientPeerId,
            myWallet.privateKey
        );
        const encMessage = JSON.stringify({
            messageType: "text",
            encrypted,
            nonce
        });
        connection.send(encMessage);
        setMessages([
            ...messages,
            { sender: peerId, content: message, type: "text" }
        ]);
        setMessage("");
        playSendSound();
        toast.success("Message sent!");
    }
};

export const handleSendFile = async ({
    e,
    connection,
    recipientPeerId,
    myWallet,
    peerId,
    setMessages,
    messages
}) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        const confirmEncrypt = window.confirm(
            "Do you want to encrypt the file before sending?"
        );
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileBuffer = Buffer.from(event.target.result);
            let encMessage;
            let fileName = selectedFile.name;

            if (confirmEncrypt) {
                const encryptedFileData = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey
                );
                encMessage = JSON.stringify(encryptedFileData);
                fileName = `encrypted${encryptFileCounter++}${fileName.substring(
                    fileName.lastIndexOf(".")
                )}.txt`; // שינוי שם הקובץ שיכלול את התוכן המוצפן כטקסט
            } else {
                encMessage = fileBuffer.toString("hex");
            }

            connection.send(
                JSON.stringify({
                    messageType: "file",
                    data: encMessage,
                    fileName
                })
            );

            const fileURL = URL.createObjectURL(
                new Blob([encMessage], {
                    type: "text/plain" // שינוי סוג הקובץ ל-text/plain כדי להוריד כטקסט
                })
            );

            const displayName = confirmEncrypt ? fileName : `${fileName} (Not Encrypted)`;

            setMessages([
                ...messages,
                {
                    sender: peerId,
                    content: displayName,
                    type: "file",
                    url: fileURL,
                    encrypted: confirmEncrypt
                }
            ]);
        };
        reader.readAsArrayBuffer(selectedFile);
    }
};



export const handleReceiveMessage = (
    setMessages,
    privateKey,
    recipientPeerId,
    data
) => {
    const decryptedMessage = decryptText(data, recipientPeerId, privateKey);
    if (decryptedMessage !== "error") {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Peer", content: decryptedMessage, type: "text" }
        ]);
    } else {
        console.error("Failed to decrypt message.");
    }
};

export const handleReceiveFile = async (
    messages,
    setMessages,
    privateKey,
    recipientPeerId,
    data,
    openDecryptModal
) => {
    let fileURL;
    let fileName = data.fileName;
    let encrypted = false;

    if (!fileName) {
        console.error("Received file without a valid name.");
        return;
    }

    if (fileName.endsWith(".txt")) {
        // בדיקה אם הקובץ הוא קובץ טקסט המכיל הצפנה
        const encryptedObj = JSON.parse(data.data);
        if (encryptedObj && encryptedObj.nonce && encryptedObj.encrypted) {
            encrypted = true;
            const shouldDecrypt = await openDecryptModal();

            if (shouldDecrypt) {
                const decryptedBlob = decryptFile(
                    data.data,
                    recipientPeerId,
                    privateKey
                );
                if (decryptedBlob) {
                    fileURL = URL.createObjectURL(decryptedBlob);
                    fileName = fileName.replace("encrypted", "decrypted");
                    toast.success("File decrypted successfully!");
                } else {
                    console.error("File decryption failed.");
                    return;
                }
            } else {
                // אם לא מפענחים, נשמור את הקובץ כמו שהוא
                fileURL = URL.createObjectURL(
                    new Blob([JSON.stringify(encryptedObj)], {
                        type: "text/plain"
                    })
                );
            }
        } else {
            console.error("Invalid encrypted data format.");
            return;
        }
    } else {
        console.error("Received non-encrypted file.");
        return;
    }

    setMessages((prevMessages) => [
        ...prevMessages,
        {
            sender: "Peer",
            content: fileName,
            type: "file",
            url: fileURL,
            encrypted
        }
    ]);
};
