/**
 * This component displays user testimonials about the service.
 */
export default function Recommendations() {
    return (
        <section
            id="recommendations"
            className="py-20 bg-gray-100 dark:bg-gray-800"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    What Our Users Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <RecommendationCard
                        text="WhisperSend is a game-changer! I can easily encrypt and share files with my team."
                        author="Shay Zak"
                    />
                    <RecommendationCard
                        text="The encryption and decryption process is seamless. Highly recommend!"
                        author="Shir Cohen"
                    />
                    <RecommendationCard
                        text="Excellent security features and easy to use interface."
                        author="Ofek Golan"
                    />
                </div>
            </div>
        </section>
    )
}

function RecommendationCard({ text, author }) {
    return (
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">"{text}"</p>
            <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                - {author}
            </h3>
        </div>
    )
}
