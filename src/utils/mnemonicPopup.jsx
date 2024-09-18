import { useState } from "preact/hooks";

export default function MnemonicPopup({ mnemonic, onConfirm }) {
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false);

    // פונקציה להורדת המנמוניק כקובץ
    const handleDownloadMnemonic = () => {
        const blob = new Blob([mnemonic], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mnemonic.txt";
        link.click();
    };

    // פונקציה להעתקת המנמוניק ללוח
    const handleCopyMnemonic = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(mnemonic)
                .then(() => {
                    alert("Mnemonic copied to clipboard!");
                })
                .catch((err) => {
                    console.error("Failed to copy mnemonic: ", err);
                });
        } else {
            // fallback לשימוש במקרה שאין תמיכה ב-navigator.clipboard
            const textarea = document.createElement("textarea");
            textarea.value = mnemonic;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                alert("Mnemonic copied to clipboard!");
            } catch (err) {
                console.error("Fallback: Failed to copy mnemonic", err);
            }
            document.body.removeChild(textarea);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Mnemonic Words</h2>
                <p className="mb-4">
                    Please save the following mnemonic phrase. You will need it
                    to decrypt your files.
                </p>
                {/* הוספת אפשרות להעתיק את הטקסט בלחיצה */}
                <div
                    className="bg-gray-200 p-4 rounded mb-4 cursor-pointer"
                    onClick={handleCopyMnemonic} // נוסיף את הפונקציה כאן להעתיק בלחיצה על הטקסט
                >
                    {mnemonic}
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleDownloadMnemonic}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Download Mnemonic
                    </button>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="confirm"
                        className="mr-2"
                        checked={isMnemonicConfirmed}
                        onChange={() =>
                            setIsMnemonicConfirmed(!isMnemonicConfirmed)
                        }
                    />
                    <label htmlFor="confirm" className="text-gray-700">
                        I have written down the mnemonic phrase
                    </label>
                </div>
                <button
                    onClick={() => {
                        if (isMnemonicConfirmed) {
                            handleCopyMnemonic(); // הוספת העתקה בעת לחיצה על Confirm
                            onConfirm();
                        } else {
                            alert("Please confirm that you saved the mnemonic.");
                        }
                    }}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
