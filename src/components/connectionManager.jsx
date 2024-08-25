import { useContext, useEffect } from "preact/hooks"
import { Context } from "../utils/context"
import { usePeer } from "../hooks/usePeer"
import { ethers } from "ethers"

export default function ConnectionManager({ children }) {
    const { state, dispatch } = useContext(Context)

    // Initialize peer connection and handle connection logic
    const { peer, connect } = usePeer(dispatch, state)

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom()
        console.log("Generated new wallet:", newWallet)
        dispatch({ type: "SET_WALLET", payload: newWallet })
        dispatch({ type: "SET_PEER_ID", payload: newWallet.publicKey })
    }, [dispatch])

    useEffect(() => {
        if (state.recipient && state.recipient.address && peer) {
            connect(state.recipient.address)
        }
    }, [state.recipient, peer, connect])

    return <>{children}</>
}
