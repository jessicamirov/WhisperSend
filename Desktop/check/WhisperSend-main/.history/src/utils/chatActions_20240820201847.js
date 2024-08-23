import { toast } from "react-toastify";
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile,
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
    setMessage,
}) => {
    if (message.trim() && connection) {
        console.log("Encrypting and sending message...");
        const { encrypted, nonce } = encryptText(
            message,
            recipientPeerId,
            myWallet.privateKey
        );
        const encMessage = JSON.stringify({
            messageType: "text",
            encrypted,
            nonce,
        });
        connection.send(encMessage);
        setMessages([
            ...messages,
            { sender: peerId, content: message, type: "text" },
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
    messages,
}) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        console.log("File selected for sending:", selectedFile.name);
        const confirmEncrypt = window.confirm(
            "Do you want to encrypt the file before sending?"
        );
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileBuffer = Buffer.from(event.target.result);
            let encMessage;
            let fileName = selectedFile.name;
            if (confirmEncrypt) {
                console.log("Encrypting file...");
                fileName = `encrypted${encryptFileCounter++}${fileName.substring(
                    fileName.lastIndexOf(".")
                )}`;
                encMessage = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey
                );
            } else {
                encMessage = fileBuffer.toString("hex");
            }

            console.log("Sending file:", fileName);
            connection.send(
                JSON.stringify({
                    messageType: "file",
                    data: encMessage,
                    fileName: fileName,
                })
            );

            const fileURL = URL.createObjectURL(
                new Blob([fileBuffer], {
                    type: "application/octet-stream",
                })
            );
            setMessages([
                ...messages,
                {
                    sender: peerId,
                    content: fileName,
                    type: "file",
                    url: fileURL,
                    encrypted: confirmEncrypt,
                },
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
    console.log("Decrypting received message...");
    const decryptedMessage = decryptText(data, recipientPeerId, privateKey);
    if (decryptedMessage !== "error") {
        console.log("Message decrypted successfully:", decryptedMessage);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Peer", content: decryptedMessage, type: "text" },
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
    console.log("Handling received file...");
    let fileURL;
    let fileName = data.fileName;
    let encrypted = false;

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
        toast.success("File received!");
    } else {
        console.log("File is encrypted. Parsing data...");
        const parsedData = JSON.parse(data.data);
        const { nonce, encrypted: encryptedData } = parsedData;

        if (!nonce || !encryptedData) {
            console.error("Invalid nonce or encrypted data:", nonce, encryptedData);
            return;
        }

        const fileBuffer = Buffer.from(encryptedData, "hex");
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], { type: "application/octet-stream" })
        );
        encrypted = true;
        toast.success("Encrypted file received!");

        // Wait for user's decision on decryption
        console.log("Opening decrypt modal...");
        const shouldDecrypt = await openDecryptModal();

        console.log("User selected:", shouldDecrypt ? "Decrypt" : "Do not decrypt");
        if (shouldDecrypt) {
            console.log("yes he chose Decrypting file...");
            const decryptedFileURL = decryptFile(
                data.data,
                recipientPeerId,
                privateKey
            );
            if (decryptedFileURL) {
                fileURL = decryptedFileURL;
                fileName = fileName.replace("encrypted", "decrypted");
                toast.success("he chose no  so File decrypted!");
                console.log("File decrypted successfully:", fileName);
            } else {
                console.error("File decryption failed.");
                return;
            }
        } else {
            console.log("User chose not to decrypt the file.");
        }
    }

    const fileAlreadyExists = messages.some(
        (msg) => msg.content === fileName && msg.type === "file"
    );
    if (!fileAlreadyExists) {
        console.log("Adding file to messages:", fileName);
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: "Peer",
                content: fileName,
                type: "file",
                url: fileURL,
                encrypted: encrypted,
            },
        ]);
    }
};
