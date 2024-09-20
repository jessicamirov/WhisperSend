/**
 * ConfirmModal component displays a customizable confirmation dialog.
 * 
 * This general-purpose modal is used across the site to show messages such as "Do you want to encrypt?" or 
 * "Do you want to decrypt?". It receives dynamic content via props for the title, message, and action buttons.
 */
export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white p-6 rounded-lg shadow-lg"
                style={{
                    maxWidth: "90%",
                    wordWrap: "break-word",
                    width: "auto", 
                }}
            >
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="mb-6" style={{ whiteSpace: "pre-wrap" }}>
                    {message}
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
