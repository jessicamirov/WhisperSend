import React from "preact/compat";

export default function DecryptModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Decrypt File</h2>
                <p className="mb-6">Do you want to decrypt the received file?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => onCancel(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Decrypt
                    </button>
                </div>
            </div>
        </div>
    );
}
