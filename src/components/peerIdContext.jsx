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

let localInitiatedDisconnect = false // משתנה גלובלי למעקב אחרי יוזמת הניתוק
let localRejected = false // משתנה גלובלי למעקב אחרי דחיית החיבור
let connectionCancelled = false // משתנה למעקב אחרי ביטול חיבור

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
            // הצד המקבל מעדכן את recipientPeerId
            setRecipientPeerId(con.peer)

            con.on("data", (data) => {
                const parsedData = JSON.parse(data)

                if (parsedData.type === "connection-cancelled") {
                    // קלט הודעת ביטול חיבור
                    connectionCancelled = true
                    toast.error("The peer has cancelled the connection.")
                    con.close() // סגירת החיבור
                    return
                }
            })

            // בדיקת קבלת החיבור לאחר אישור
            openConfirmModal(
                "Incoming Connection",
                `Do you want to accept the connection request from ${con.peer}?`,
            ).then((accepted) => {
                if (accepted) {
                    if (connectionCancelled) {
                        // אם החיבור בוטל על ידי הצד השני, לא ממשיכים
                        toast.error("The peer has cancelled the connection.")
                        return // עצירה כאן
                    }
                    con.send(JSON.stringify({ type: "connection-accepted" }))
                    setConnection(con)
                    setRecipient(con.peer)
                    route(`/chat/${con.peer}`)

                    con.on("data", (data) => handleData(data, con.peer))
                    con.on("close", () =>
                        handleRemoteDisconnect(false, con.peer),
                    )
                } else {
                    localRejected = true
                    con.send(JSON.stringify({ type: "connection-rejected" }))
                    con.close()
                }
            })
        })
    }, [peer])

    const safelyCloseConnection = () => {
        if (connection) {
            connection.send(
                JSON.stringify({ type: "disconnect-notify", peerId }),
            )
            connection.close()
        }
    }

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
                console.log("open !!!!!!!!!!!!")
                con.on("data", function (data) {
                    const parsedData = JSON.parse(data)
                    if (parsedData.type === "connection-accepted") {
                        if (connectionCancelled) {
                            toast.error("You have cancelled the connection.")
                            safelyCloseConnection()
                            performDisconnect() // השארת המשתמש בעמוד shareSecurely
                            return
                        }

                        setConnection(con)
                        setRecipientPeerId(recId)
                        toast.dismiss()
                        route(`/chat/${recId}`)
                        resolve()
                    } else if (parsedData.type === "connection-rejected") {
                        localRejected = true // עדכון משתנה גלובלי
                        toast.dismiss()
                        toast.error("Connection was rejected by the peer.", {
                            position: "top-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            draggable: true,
                            progress: undefined,
                        })
                        console.log("168")

                        // handleRemoteDisconnect(true, recId, true);
                        reject(new Error("Connection rejected by peer"))
                    } else if (parsedData.type === "disconnect-notify") {
                        console.log("173")

                        handleRemoteDisconnect(false, parsedData.peerId)
                    } else {
                        handleData(data, recId)
                    }
                })

                con.on("close", () => {
                    if (!localInitiatedDisconnect && !localRejected) {
                        console.log("183")
                        handleRemoteDisconnect(false, recId)
                    }
                })
            })

            con.on("error", (err) => {
                toast.dismiss()
                reject(err)
            })
        })
    }

    const cancelConnection = () => {
        connectionCancelled = true // עדכון המשתנה לביטול החיבור
        safelyCloseConnection()
        performDisconnect() // ביטול מיידי והשארה בעמוד shareSecurely
    }

    const disconnect = (initiatedByUser = false) => {
        localInitiatedDisconnect = initiatedByUser
        if (initiatedByUser) {
            setInitiatedDisconnect(true)
        }

        safelyCloseConnection()
        performDisconnect()
    }

    const performDisconnect = () => {
        setIsDisconnected(true)
        safelyCloseConnection()
        setConnection(null)
        setRecipient("")
        setRecipientPeerId("")
        setMessages([])
        setMessage("")
        setInitiatedDisconnect(false)
        localInitiatedDisconnect = false // איפוס המשתנה הגלובלי
        localRejected = false // איפוס דחיית החיבור
        connectionCancelled = false // איפוס ביטול החיבור
        route("/shareSecurely")
    }

    const handleRemoteDisconnect = (
        rejected = false,
        disconnectedPeerId = peerId,
    ) => {
        if (rejected || localRejected || localInitiatedDisconnect) {
            // אם החיבור נדחה או שהמשתמש יזם את הניתוק, נבצע ניתוק מידי
            performDisconnect()
        } else {
            // אם המשתמש לא יזם את הניתוק, נבקש ממנו אישור להמשיך
            openConfirmModal(
                "Peer Disconnected",
                `${disconnectedPeerId || "The other user"} has left the chat. Do you want to leave the chat as well?`,
            ).then((confirmed) => {
                if (confirmed) {
                    performDisconnect()
                } else {
                    setIsDisconnected(true) // משתמש נשאר בצ'אט אך מנותק
                    setShowExitButton(true) // מציג כפתור יציאה אם הוא רוצה לעזוב מאוחר יותר
                }
            })
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
    console.log("Received data:", data)

    try {
        // בדיקה אם מדובר בקובץ בינארי (ArrayBuffer או Blob)
        if (data instanceof ArrayBuffer || data instanceof Blob) {
            console.log("Received unencrypted file in binary format.")
            handleReceiveFile(
                messages,
                setMessages,
                myWallet.privateKey,
                senderPeerId,
                { fileName: "received_file", data }, // נתונים בינאריים
                openConfirmModal,
            )
        } else {
            // אם מדובר בנתונים שמגיעים כ-JSON, ננתח אותם כ-JSON
            const parsedData = JSON.parse(data)

            if (parsedData.messageType === "file") {
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
        }
    } catch (error) {
        console.error("Error parsing data:", error)
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
                cancelConnection, // נוספה פונקציה לביטול חיבור
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
