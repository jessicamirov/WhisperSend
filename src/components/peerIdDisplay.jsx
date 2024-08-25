import { useContext } from "preact/hooks"
import { Context } from "../utils/context" // ייבוא של הקונטקסט המרכזי

export default function PeerIdDisplay() {
    const { state } = useContext(Context) // שימוש ב-context המעודכן
    const { peerId } = state // קבלת ה-peerId מה-state

    return (
        <div>
            <h2>Your Peer ID</h2>
            <p>{peerId}</p>
        </div>
    )
}
