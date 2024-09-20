export default function Message({ text, me }) {
 /**
 * This component renders a single chat message.
 * It adjusts the text style depending on whether the message
 * was sent by the user (me) or received from the others:
 * Messages sent by the user are aligned to the left with a specific text color.
 * Received messages are aligned to the right.
 */
   
    return (
        <div
            class={`py-2 border-b border-dashed border-slate-500 ${me ? "text-left text-slate-500" : "text-right"}`}
        >
            {text}
        </div>
    )
}
