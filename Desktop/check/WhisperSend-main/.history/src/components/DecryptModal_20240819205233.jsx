export default function DecryptModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Decrypt File</h2>
                <p className="mb-4">Do you want to decrypt the received file?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Decrypt
                    </button>
                </div>
            </div>
        </div>
    );
}
