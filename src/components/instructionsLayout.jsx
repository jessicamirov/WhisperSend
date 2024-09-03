import { h } from "preact"
import { useState, useEffect } from "preact/hooks"

export default function InstructionsLayout({ title, steps }) {
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768) // נקודת השבירה
        }

        window.addEventListener("resize", handleResize)
        handleResize() // כדי להפעיל את ההגדרה בהתחלה

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="w-full">
            {isSmallScreen && !showInstructions ? (
                <button
                    onClick={() => setShowInstructions(true)}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                >
                    Show Instructions
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        {title}
                    </h3>
                    <div className="space-y-4">
                        {steps.map(({ step, color, title, description }) => (
                            <div
                                key={step}
                                className="flex items-center space-x-2"
                            >
                                <div
                                    className={`step-circle bg-${color}-500 text-white font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full`}
                                >
                                    {step}
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
                    {isSmallScreen && (
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full px-4 py-2 mt-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                        >
                            Hide Instructions
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
