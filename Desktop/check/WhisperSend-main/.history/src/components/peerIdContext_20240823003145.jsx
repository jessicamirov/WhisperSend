import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import Peer from "peerjs";
import { ethers } from "ethers";
import DecryptModal from "../components/DecryptModal";

// ייבוא הפונקציות מקובץ ההצפנה
import { encryptText, decryptText, encryptFile, decryptFile } from '../path-to/encdec.js'; // עדכן את הנתיב לפי המיקום של הקובץ

export const PeerIdContext = createContext();

export const PeerIdProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [myWallet, setMyWallet] = useState(null);
    const [recipientPeerId, setRecipientPeerId] = useState("");
    const [peerId, setPeerId] = useState("");
    const [showDecryptModal, setShowDecryptModal] = useState(false);
    const [decryptCallback, setDecryptCallback] = useState(null);

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom();
        const { publicKey, privateKey } = newWallet;
        setMyWallet(newWallet);
        setPeerId(publicKey);
        console.log("Wallet created with public key:", publicKey);
    }, []);

    useEffect(() => {
        if (!myWallet) return;

        const pr = new Peer(myWallet.publicKey, peerConfig);
        setPeer(pr);
        console.log("Peer created with ID:", myWallet.publicKey);

        return () => {
            pr.destroy();
            console.log("Peer destroyed");
        };
    }, [myWallet]);

    useEffect(() => {
        if (!peer) return;

        peer.on("connection", (con) => {
            console.log("Connection received from peer:", con.peer);
            con.on("open", () => {
                console.log("Connection opened with peer:", con.peer);
                setRecipient(con.peer);
                setRecipientPeerId(con.peer);
                setConnection(con);
            });
        });
    }, [peer]);

    useEffect(() => {
        if (!connection) return;

        connection.on("data", function (data) {
            console.log("Data received:", data);
            handleData(data);
        });
        connection.on("close", () => {
            console.log("Connection closed");
            disconnect();
        });
        connection.on("error", (err) => {
            console.error("Connection error:", err);
        });
    }, [connection]);

    const connectRecipient = (e) => {
        e.preventDefault();
        if (connection) {
            console.log("Disconnecting existing connection");
            disconnect();
        } else {
            console.log("Connecting to recipient:", recipient);
            connect(recipient);
            setRecipientPeerId(recipient);
        }
    };

    const connectToPeer = (recId) => {
        console.log("Attempting to connect to peer:", recId);
        const con = peer.connect(recId);
        setConnection(con);
        setRecipientPeerId(recId);
        console.log("Connection established with peer:", recId);
    };

    const disconnect = () => {
        if (connection) {
            connection.close();
            console.log("Connection closed by user");
            setConnection(null);
        }
        setRecipient("");
        setRecipientPeerId("");
        setMessages([]);
        setMessage("");
    };

    const openDecryptModal = () => {
        console.log("Opening decrypt modal...");

        return new Promise((resolve) => {
            setDecryptCallback(() => resolve);
            setShowDecryptModal(true);
        });
    };

    const closeDecryptModal = (confirmed) => {
        setShowDecryptModal(false);
        console.log("Decrypt modal closed. User confirmed:", confirmed);

        if (decryptCallback) {
            decryptCallback(confirmed);
        }
    };

    const handleData = (data) => {
        try {
            const parsedData = JSON.parse(data);
            console.log("Parsed data:", parsedData);

            if (parsedData.messageType === "file") {
                console.log("File received. Passing to handleReceiveFile...");
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    parsedData,
                    openDecryptModal // Passing the function to handle file decryption
                );
            } else if (parsedData.messageType === "text") {
                console.log("Text message received. Passing to handleReceiveMessage...");
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    data
                );
            } else {
                console.log("Unknown messageType received in handleData");
            }
        } catch (error) {
            console.log("Received non-JSON text data in handleData");
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                recipientPeerId,
                data
            );
        }
    };

    const sendMessage = (message, recipientPublicKey) => {
        if (!connection) return;

        const encryptedMessage = encryptText(message, recipientPublicKey, myWallet.privateKey);
        connection.send(JSON.stringify(encryptedMessage));
    };

    const sendFile = (fileBuffer, recipientPublicKey) => {
        if (!connection) return;

        const encryptedFile = encryptFile(fileBuffer, recipientPublicKey, myWallet.privateKey);
        connection.send(JSON.stringify(encryptedFile));
    };

    return (
        <PeerIdContext.Provider
            value={{
                peer,
                connectToPeer,
                connectRecipient,
                disconnect,
                connection,
                recipient,
                setRecipient,
                messages,
                setMessages,
                message,
                setMessage,
                myWallet,
                peerId,
                recipientPeerId,
                setRecipientPeerId,
                sendMessage,
                sendFile
            }}
        >
            {children}
            {showDecryptModal && (
                <DecryptModal
                    onConfirm={() => closeDecryptModal(true)}
                    onCancel={() => closeDecryptModal(false)}
                />
            )}
        </PeerIdContext.Provider>
    );
};
