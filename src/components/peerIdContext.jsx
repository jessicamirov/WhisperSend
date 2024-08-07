// src/components/peerIdContext.jsx
import { createContext, h } from "preact"
import { useState, useEffect } from "preact/hooks"
import Peer from "peerjs"
import { ethers } from "ethers"
import nacl from "tweetnacl"
import { Buffer } from "buffer"
import elliptic from "elliptic"
const ec = elliptic.ec

export const PeerIdContext = createContext()

export const PeerIdProvider = ({ children }) => {
    const [peer, setPeer] = useState(null)
    const [connection, setConnection] = useState(null)
    const [recipient, setRecipient] = useState("")
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [myWallet, setMyWallet] = useState(null)
    const [recipientPeerId, setRecipientPeerId] = useState("")
    const [peerId, setPeerId] = useState("")

    const getSharedSecret = (publicKeyHex, privateKeyHex) => {
        const secp256k1 = new ec("secp256k1")
        const senderEcKey = secp256k1.keyFromPrivate(
            privateKeyHex.slice(2),
            "hex",
        )
        const recipientEcKey = secp256k1.keyFromPublic(
            publicKeyHex.slice(2),
            "hex",
        )
        const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic())
        return Buffer.from(sharedSecret.toArray("be", 32))
    }

    const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
        const sharedSecret = getSharedSecret(
            recipientPublicKey,
            senderPrivateKey,
        )
        const nonce = nacl.randomBytes(24)
        const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret)

        const encryptedObj = {
            nonce: Buffer.from(nonce).toString("hex"),
            encrypted: Buffer.from(encrypted).toString("hex"),
        }
        console.log("Encrypted text:", encryptedObj) // Log the encrypted text
        return encryptedObj
    }

    const decryptText = (
        encryptedMessage,
        senderPublicKey,
        recipientPrivateKey,
    ) => {
        const encryptedObj = JSON.parse(encryptedMessage)
        try {
            const sharedSecret = getSharedSecret(
                senderPublicKey,
                recipientPrivateKey,
            )
            const { nonce, encrypted } = encryptedObj
            const decrypted = nacl.box.open.after(
                Uint8Array.from(Buffer.from(encrypted, "hex")),
                Uint8Array.from(Buffer.from(nonce, "hex")),
                sharedSecret,
            )
            if (decrypted) {
                const decryptedMessage = Buffer.from(decrypted).toString()
                console.log("Decrypted message:", decryptedMessage) // Log the decrypted message
                return decryptedMessage
            } else {
                console.error(
                    "Decryption failed. Check keys, nonce, and encrypted values.",
                )
                return "error"
            }
        } catch (error) {
            console.error("Decryption process error:", error)
            return "error"
        }
    }

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom()
        const { publicKey, privateKey } = newWallet
        console.log("Wallet:", { publicKey, privateKey })
        setMyWallet(newWallet)
        setPeerId(publicKey) // Set the peer ID
    }, [])

    useEffect(() => {
        if (!myWallet) return

        const pr = new Peer(myWallet.publicKey)
        setPeer(pr)

        pr.on("open", (id) => {
            console.log("My peer ID is: " + id)
            setPeerId(id)
        })

        return () => {
            pr.destroy()
        }
    }, [myWallet])

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

    const connectToPeer = (recId) => {
        const con = peer.connect(recId)
        setConnection(con)
        setRecipientPeerId(recId)
        console.log("Connection established - sender")
    }

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

    const handleData = (data) => {
        console.log("Received data:", data) // Log the received data
        const decryptedMessage = decryptText(
            data,
            recipientPeerId,
            myWallet.privateKey,
        )
        if (decryptedMessage !== "error") {
            setMessages((prevMessages) => [
                ...prevMessages,
                { me: false, text: decryptedMessage },
            ])
        }
    }

    return (
        <PeerIdContext.Provider
            value={{
                peer,
                connectToPeer,
                disconnect,
                connection,
                recipient,
                setRecipient,
                messages,
                setMessages,
                message,
                setMessage,
                myWallet,
                encryptText,
                decryptText,
                peerId,
                recipientPeerId,
                setRecipientPeerId,
            }}
        >
            {children}
        </PeerIdContext.Provider>
    )
}
