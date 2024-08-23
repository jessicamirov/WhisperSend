import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import { createContext, useState, useEffect } from "preact/hooks";
import Peer from "peerjs";
import { handleReceiveMessage, handleReceiveFile } from "../utils/chatActions";
import { peerConfig } from "../utils/config";
import { ethers } from "ethers";
import DecryptModal from "../components/DecryptModal"; // Import the modal component

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
    }, []);

    useEffect(() => {
        if (!myWallet) return;

        const pr = new Peer(myWallet.publicKey, peerConfig);
        setPeer(pr);
        return () => {
            pr.destroy();
        };
    }, [myWallet]);

    useEffect(() => {
        if (!peer) return;

        peer.on("connection", (con) => {
            console.log("Connection received");
            con.on("open", () => {
                console.log("Connected");
                setRecipient(con.peer);
                setRecipientPeerId(con.peer);
                setConnection(con);
            });
        });
    }, [peer]);

    useEffect(() => {
        if (!connection) return;

        connection.on("data", function (data) {
            handleData(data);
        });
        connection.on("close", () => {
            disconnect();
        });
        connection.on("error", (err) => {
            console.error("Connection error:", err);
        });
    }, [connection]);

    const connectRecipient = (e) => {
        e.preventDefault();
        if (connection) {
            disconnect();
        } else {
            connect(recipient);
            setRecipientPeerId(recipient);
        }
    };

    const connectToPeer = (recId) => {
        const con = peer.connect(recId);
        setConnection(con);
        setRecipientPeerId(recId);
        console.log("Connection established - sender");
    };

    const disconnect = () => {
        if (connection) {
            connection.close();
            setConnection(null);
        }
        setRecipient("");
        setRecipientPeerId("");
        setMessages([]);
        setMessage("");
    };

    const openDecryptModal = (callback) => {
        setDecryptCallback(() => callback);
        setShowDecryptModal(true);
    };

    const closeDecryptModal = (confirmed) => {
        setShowDecryptModal(false);
        if (confirmed && decryptCallback) {
            decryptCallback();
        }
    };

    const handleData = (data) => {
        try {
            const parsedData = JSON.parse(data);

            if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    parsedData,
                    openDecryptModal // Passing the function to handle file decryption
                );
            } else if (parsedData.messageType === "text") {
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
            console.log("Text received that is not JSON in handleData");
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                recipientPeerId,
                data
            );
        }
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
