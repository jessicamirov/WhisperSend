import { useContext } from "preact/hooks"
import { PeerIdContext } from "./peerIdContext"

export default function PeerIdDisplay() {
    const { peerId } = useContext(PeerIdContext)

    return (
        <div>
            <h2>Your Peer ID</h2>
            <p>{peerId}</p>
        </div>
    )
}

