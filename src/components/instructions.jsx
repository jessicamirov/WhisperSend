export const decryptionInstructions = [
    {
        step: 1,
        color: "blue",
        title: "Upload an encrypted file",
        description: "Choose an encrypted file to decrypt.",
    },
    {
        step: 2,
        color: "green",
        title: "Enter encryption key",
        description: "Enter the encryption key or use your mnemonic.",
    },
    {
        step: 3,
        color: "yellow",
        title: "Decrypt",
        description: 'Click the "Decrypt" button to decrypt the file.',
    },
    {
        step: 4,
        color: "red",
        title: "Download decrypted file",
        description:
            "Download the decrypted file once the process is complete.",
    },
]

export const encryptionInstructions = [
    {
        step: 1,
        color: "blue",
        title: "Select a file",
        description: "Choose a file to encrypt.",
    },
    {
        step: 2,
        color: "green",
        title: "Encrypt",
        description: 'Click "Encrypt & Save" to encrypt the file.',
    },
    {
        step: 3,
        color: "yellow",
        title: "Save file and keys",
        description: "Download the encrypted file and the keys.",
    },
    {
        step: 4,
        color: "red",
        title: "Store securely",
        description: "Store the encryption keys securely.",
    },
]

export const chatInstructions = [
    {
        step: 1,
        color: "blue",
        title: "Connect",
        description: "Enter peer ID and click 'Connect'.",
    },
    {
        step: 2,
        color: "green",
        title: "Message",
        description: "Type and send your message.",
    },
    {
        step: 3,
        color: "yellow",
        title: "Send File",
        description: "Click paperclip to select a file.",
    },
    {
        step: 4,
        color: "red",
        title: "Encrypt",
        description: "Click 'Encrypt & Send' to send file.",
    },
    {
        step: 5,
        color: "purple",
        title: "Decrypt",
        description: "Click 'Decrypt' to view received file.",
    },
]

export default function Instructions({ title, steps }) {
    return (
        <div className="w-1/4 pr-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl h-full">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    {title}
                </h3>
                <div className="space-y-4">
                    {steps.map(({ step, color, title, description }) => (
                        <div key={step} className="flex items-center space-x-2">
                            <div className={`step-circle bg-${color}-500`}>
                                <span className="text-white font-bold text-xl">
                                    {step}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
