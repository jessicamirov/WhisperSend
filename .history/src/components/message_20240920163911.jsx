export default function Message({ text, me }) {
    return (
        <div
            class={`py-2 border-b border-dashed border-slate-500 ${me ? "text-left text-slate-500" : "text-right"}`}
        >
            {text}
        </div>
    )
}
