export default function InstructionsLayout({ title, steps }) {
    return (
        <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
                {steps.map((step) => (
                    <div
                        key={step.step}
                        className="flex flex-col items-center text-center"
                    >
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full bg-${step.color}-500 text-white mb-2 mx-auto`}
                        >
                            {step.step}
                        </div>
                        <p className="font-bold text-sm mb-1 text-white">
                            {step.title}
                        </p>{" "}
                        <p className="text-xs text-white">
                            {step.description}
                        </p>{" "}
                    </div>
                ))}
            </div>
        </div>
    )
}
