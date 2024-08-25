import { useEffect, useState, useRef } from "preact/hooks"
import { Peer } from "peerjs"
import { peerConfig } from "../utils/config"
import { encryptText, decryptText } from "../utils/encryption"

export const usePeer = (dispatch, state) => {
    const [peer, setPeer] = useState(null)
    const [conn, setConn] = useState(null)
    const peerInitializedRef = useRef(false)

    // Initialize the peer when the wallet state changes
    useEffect(() => {
        if (state.myWallet) {
            const pr = new Peer(state.myWallet.publicKey, {
                ...peerConfig,
                debug: 2,
            })

            pr.on("open", (id) => {
                setPeer(pr)
                dispatch({ type: "SET_PEER", payload: pr })
                dispatch({ type: "SET_ADDRESS", payload: id }) // Set the peer ID
                console.log("Peer opened with ID:", id)
            })

            pr.on("connection", (connection) => {
                setConn(connection)
                connection.on("data", (data) => {
                    console.log("Data received:", data)
                    if (data.encryptedText) {
                        const decryptedData = decryptText(
                            data.encryptedText,
                            data.encryptedAesKey,
                            state.myWallet.privateKey,
                        )
                        console.log("Decrypted message:", decryptedData)
                        dispatch({
                            type: "ADD_MESSAGE",
                            payload: { message: decryptedData, isMine: false },
                        })
                    } else {
                        dispatch({
                            type: "ADD_MESSAGE",
                            payload: { message: data, isMine: false },
                        })
                    }
                })
            })

            pr.on("error", (err) => {
                console.error("Peer error:", err)
            })

            return () => {
                pr.destroy() // Cleanup on unmount
            }
        }
    }, [state.myWallet, dispatch])

    // Function to connect to another peer
    const connect = (recId) => {
        if (!peer) {
            console.error("Peer not initialized.")
            return
        }

        const connection = peer.connect(recId, {
            metadata: state.myWallet.publicKey,
        })
        setConn(connection)

        connection.on("open", () => {
            console.log("Connection established with:", recId)
            dispatch({ type: "CONNECT", payload: true })
        })

        connection.on("error", (err) => {
            console.error("Error during connection:", err)
        })
    }

    return { peer, connect }
}
