import { route } from "preact-router"

export default function FeaturesOverview() {
    return (
        <section
            id="features-overview"
            className="py-20 bg-gray-100 dark:bg-gray-800"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    Choose your desired action:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Encrypt Files"
                        description="Keep your files on your device secure and protected from unauthorized access"
                        imgSrc="/src/assets/encrypt.png"
                        routePath="/encrypt"
                    />
                    <FeatureCard
                        title="Decrypt Files"
                        description="Only you can access your confidential files"
                        imgSrc="/src/assets/decrypt.png"
                        routePath="/decrypt"
                    />
                    <FeatureCard
                        title="Secure Chat"
                        description="Chat and send files securely"
                        imgSrc="/src/assets/securechat.png"
                        routePath="/shareSecurely"
                    />
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ title, description, imgSrc, routePath }) {
    return (
        <div
            className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
            onClick={() => route(routePath)}
        >
            <img src={imgSrc} alt={title} className="mx-auto mb-4 w-16 h-16" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}
