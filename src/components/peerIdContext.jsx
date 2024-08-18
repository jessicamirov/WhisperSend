import { createContext } from "preact"
import { useState, useEffect } from "preact/hooks"
import Peer from "peerjs"
import { handleReceiveMessage, handleReceiveFile } from "../utils/chatActions"
import { peerConfig } from "../utils/config"
import { ethers } from "ethers"

export const PeerIdContext = createContext()

/**
 * Provides the PeerJS and messaging context for the application.
 * Manages peer-to-peer connections, wallet generation, and message handling.
 */
export const PeerIdProvider = ({ children }) => {
    const [peer, setPeer] = useState(null)
    const [connection, setConnection] = useState(null)
    const [recipient, setRecipient] = useState("")
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [myWallet, setMyWallet] = useState(null)
    const [recipientPeerId, setRecipientPeerId] = useState("")
    const [peerId, setPeerId] = useState("")

    /**
     * Generates a new Ethereum wallet and sets the peer ID to the wallet's public key.
     */
    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom()
        const { publicKey, privateKey } = newWallet
        setMyWallet(newWallet)
        setPeerId(publicKey)
    }, [])

    /**
     * Initializes the PeerJS peer with the generated public key.
     * Destroys the peer on component unmount.
     */
    useEffect(() => {
        if (!myWallet) return

        const pr = new Peer(myWallet.publicKey, peerConfig)
        setPeer(pr)
        return () => {
            pr.destroy()
        }
    }, [myWallet])

    /**
     * Sets up connection event listeners on the peer instance.
     * Handles incoming connections and sets up the connection state.
     */
    useEffect(() => {
        if (!peer) return

        peer.on("connection", (con) => {
            console.log("Connection received")
            con.on("open", () => {
                console.log("Connected")
                setRecipient(con.peer)
                setRecipientPeerId(con.peer)
                setConnection(con)
            })
        })
    }, [peer])

    /**
     * Sets up data, close, and error event listeners on the connection.
     * Handles incoming data and manages connection state on close or error.
     */
    useEffect(() => {
        if (!connection) return

        connection.on("data", function (data) {
            handleData(data)
        })
        connection.on("close", () => {
            disconnect()
        })
        connection.on("error", (err) => {
            console.error("Connection error:", err)
        })
    }, [connection])

    /**
     * Connects to the recipient peer or disconnects if already connected.
     * @param {Event} e - The event triggered by a form submission or button click.
     */
    const connectRecipient = (e) => {
        e.preventDefault()
        if (connection) {
            disconnect()
        } else {
            connect(recipient)
            setRecipientPeerId(recipient)
        }
    }

    /**
     * Establishes a connection to a specific peer ID.
     * @param {string} recId - The peer ID to connect to.
     */
    const connectToPeer = (recId) => {
        const con = peer.connect(recId)
        setConnection(con)
        setRecipientPeerId(recId)
        console.log("Connection established - sender")
    }

    /**
     * Disconnects the current connection and resets the related state.
     */
    const disconnect = () => {
        if (connection) {
            connection.close()
            setConnection(null)
        }
        setRecipient("")
        setRecipientPeerId("")
        setMessages([])
        setMessage("")
    }

    /**
     * Handles incoming data on the connection.
     * Parses the data and delegates it to the appropriate handler based on message type.
     * @param {any} data - The data received from the peer connection.
     */
    const handleData = (data) => {
        try {
            const parsedData = JSON.parse(data)

            if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    parsedData,
                )
            } else if (parsedData.messageType === "text") {
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    data,
                )
            } else {
                console.log("Unknown messageType received in handleData")
            }
        } catch (error) {
            console.log("Text received that is not JSON in handleData")
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                recipientPeerId,
                data,
            )
        }
    }

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
        </PeerIdContext.Provider>
    )
}
