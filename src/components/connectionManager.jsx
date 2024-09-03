import { createContext } from "preact"
import { useState, useEffect } from "preact/hooks"
import Peer from "peerjs"
import { handleReceiveMessage, handleReceiveFile } from "../utils/chatActions"
import { peerConfig } from "../utils/config"
import { ethers } from "ethers"
import ConfirmModal from "../utils/confirmModal"
import { route } from "preact-router"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmCallback, setConfirmCallback] = useState(null)
    const [confirmModalData, setConfirmModalData] = useState({
        title: "",
        message: "",
    })
    const [isDisconnected, setIsDisconnected] = useState(false)
    const [initiatedDisconnect, setInitiatedDisconnect] = useState(false)
    const [showExitButton, setShowExitButton] = useState(false)

    const recalculatePeerId = () => {
        const newWallet = ethers.Wallet.createRandom()
        const { publicKey } = newWallet
        setMyWallet(newWallet)
        setPeerId(publicKey)

        if (peer) {
            peer.destroy()
        }

        const newPeer = new Peer(publicKey, peerConfig)
        setPeer(newPeer)

        toast.success("Peer ID has been recalculated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom()
        const { publicKey } = newWallet
        setMyWallet(newWallet)
        setPeerId(publicKey)
    }, [])

    useEffect(() => {
        if (!myWallet) return

        const pr = new Peer(myWallet.publicKey, peerConfig)
        setPeer(pr)

        return () => {
            pr.destroy()
        }
    }, [myWallet])

    useEffect(() => {
        if (!peer) return

        peer.on("connection", (con) => {
            setRecipientPeerId(con.peer)

            openConfirmModal(
                "Incoming Connection",
                `Do you want to accept the connection request from ${con.peer}?`,
            ).then((accepted) => {
                if (accepted) {
                    con.send(JSON.stringify({ type: "connection-accepted" }))
                    setConnection(con)
                    setRecipient(con.peer)
                    route(`/chat/${con.peer}`)

                    con.on("data", (data) => handleData(data, con.peer))

                    con.on("close", () => {
                        if (!initiatedDisconnect) {
                            handleRemoteDisconnect()
                        }
                    })
                } else {
                    con.send(JSON.stringify({ type: "connection-rejected" }))
                    con.close()
                }
            })
        })
    }, [peer])

    const connectToPeer = (recId) => {
        return new Promise((resolve, reject) => {
            const con = peer.connect(recId)

            toast.info("Awaiting approval from the other user...", {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                progress: undefined,
            })

            con.on("open", () => {
                con.on("data", function (data) {
                    const parsedData = JSON.parse(data)
                    if (parsedData.type === "connection-accepted") {
                        setConnection(con)
                        setRecipientPeerId(recId)
                        toast.dismiss()
                        route(`/chat/${recId}`)
                        resolve()
                    } else if (parsedData.type === "connection-rejected") {
                        toast.dismiss()
                        toast.error("Connection was rejected by the peer.", {
                            position: "top-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            draggable: true,
                            progress: undefined,
                        })
                        reject(new Error("Connection rejected by peer"))
                    } else if (parsedData.type === "disconnect-notify") {
                        handleRemoteDisconnect(true, parsedData.peerId)
                    } else {
                        handleData(data, recId)
                    }
                })

                con.on("close", () => {
                    if (!initiatedDisconnect) {
                        handleRemoteDisconnect(false)
                    }
                })
            })

            con.on("error", (err) => {
                toast.dismiss()
                reject(err)
            })
        })
    }

    const disconnect = (initiatedByUser = false) => {
        if (connection) {
            connection.send(
                JSON.stringify({ type: "disconnect-notify", peerId }),
            )
            connection.send(JSON.stringify({ type: "disconnect" }))
        }

        if (initiatedByUser) {
            setInitiatedDisconnect(true)
        }

        performDisconnect()
    }

    const performDisconnect = () => {
        setIsDisconnected(true)
        if (connection) connection.close()
        setConnection(null)
        setRecipient("")
        setRecipientPeerId("")
        setMessages([])
        setMessage("")

        route("/shareSecurely")
    }

    const handleRemoteDisconnect = (
        notify = true,
        disconnectedPeerId = peerId,
    ) => {
        if (notify) {
            openConfirmModal(
                "Peer Disconnected",
                `${disconnectedPeerId || "The other user"} has left the chat. Do you want to leave the chat as well?`,
            ).then((confirmed) => {
                if (confirmed) {
                    performDisconnect()
                } else {
                    setIsDisconnected(true)
                    setShowExitButton(true)
                }
            })
        } else if (!initiatedDisconnect) {
            performDisconnect()
        }
    }

    const handleExit = () => {
        setMessages([])
        setMessage("")
        route("/shareSecurely")
    }

    const openConfirmModal = (title, message) => {
        return new Promise((resolve) => {
            setConfirmCallback(() => resolve)
            setConfirmModalData({ title, message })
            setShowConfirmModal(true)
        })
    }

    const closeConfirmModal = (confirmed) => {
        setShowConfirmModal(false)

        if (confirmCallback) {
            confirmCallback(confirmed)
        }
    }

    const handleData = (data, senderPeerId) => {
        try {
            const parsedData = JSON.parse(data)

            if (parsedData.type === "disconnect") {
                if (!initiatedDisconnect) {
                    handleRemoteDisconnect()
                }
            } else if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId,
                    parsedData,
                    openConfirmModal,
                )
            } else if (parsedData.messageType === "text") {
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId,
                    data,
                )
            } else {
                console.log("Unknown messageType received")
            }
        } catch (error) {
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                senderPeerId,
                data,
            )
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
                peerId,
                recipientPeerId,
                setRecipientPeerId,
                openConfirmModal,
                isDisconnected,
                recalculatePeerId,
                showExitButton,
                handleExit,
            }}
        >
            {children}
            {showConfirmModal && (
                <ConfirmModal
                    title={confirmModalData.title}
                    message={confirmModalData.message}
                    onConfirm={() => closeConfirmModal(true)}
                    onCancel={() => closeConfirmModal(false)}
                />
            )}
        </PeerIdContext.Provider>
    )
}
