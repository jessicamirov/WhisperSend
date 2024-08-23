import { useState } from 'preact/hooks';

export default function DecryptModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Decrypt File</h2>
                <p className="mb-4">Do you want to decrypt the file?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Yes, Decrypt
                    </button>
                </div>
            </div>
        </div>
    );
}
