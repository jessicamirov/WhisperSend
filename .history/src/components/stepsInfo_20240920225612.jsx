/**
 * This component visually presents a series of steps that explain the process of setting up a secure chat.
 */

const steps = [
    {
        step: 1,
        color: "bg-blue-500",
        title: "Send Invite",
        description:
            "Send an invite to your peer to start a secure chat session.",
    },
    {
        step: 2,
        color: "bg-green-500",
        title: "Connect",
        description: "Enter the peer ID of your contact and connect securely.",
    },
    {
        step: 3,
        color: "bg-yellow-500",
        title: "Chat Securely",
        description: "Start chatting securely and send encrypted files.",
    },
    {
        step: 4,
        color: "bg-red-500",
        title: "Recalculate Keys",
        description:
            "Recalculate your encryption keys regularly for added security.",
    },
]

export default function StepsInfo() {
    return (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                How Secure Chat Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map(({ step, color, title, description }) => (
                    <div className="flex flex-col items-center mb-4" key={step}>
                        <div
                            className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center font-bold text-xl`}
                        >
                            {step}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                            {title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
