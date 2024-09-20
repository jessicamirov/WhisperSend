import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function ToggleInstructionsButton({
    showInstructions,
    onClick,
}) {
    return (
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
            onClick={onClick}
        >
            {showInstructions ? (
                <>
                    <FaEyeSlash className="text-xl" />
                    <span>Hide Instructions</span>
                </>
            ) : (
                <>
                    <FaEye className="text-xl" />
                    <span>Show Instructions</span>
                </>
            )}
        </button>
    )
}
