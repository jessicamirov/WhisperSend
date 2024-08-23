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
            let fileName = `encrypted${encryptFileCounter++}.txt`; // שינוי הסיומת ל .txt
            if (confirmEncrypt) {
                const encryptedFileData = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey
                );
                encMessage = JSON.stringify(encryptedFileData);
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
                new Blob([fileBuffer], {
                    type: selectedFile.type // Preserving original file type
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
          
