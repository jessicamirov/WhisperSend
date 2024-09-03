import { h } from "preact"

export default function SecureChatInfo() {
    return (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
                How Secure Chat Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                        1
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                        Send Invite
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Send an invite to your peer to start a secure chat
                        session.
                    </p>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl">
                        2
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                        Connect
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Enter the peer ID of your contact and connect securely.
                    </p>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-xl">
                        3
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                        Chat Securely
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Start chatting securely and send encrypted files.
                    </p>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xl">
                        4
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                        Recalculate Keys
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Recalculate your encryption keys regularly for added
                        security.
                    </p>
                </div>
            </div>
        </div>
    )
}
