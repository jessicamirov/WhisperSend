/**
 * CommonQuestions component displays a list of frequently asked questions (FAQs) in a grid layout.
 */

export default function CommonQuestions() {
    return (
        <section id="faq" className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <FaqCard
                        question="How secure is WhisperSend?"
                        answer="The technologies we use ensure top-level security."
                    />
                    <FaqCard
                        question="Is my data stored anywhere?"
                        answer="No, your data is not stored on our servers. It remains on your device, and only encrypted files are transmitted"
                    />
                    <FaqCard
                        question="What happens if I lose my private key?"
                        answer="Unfortunately, without your private key, you will not be able to decrypt your files. We recommend keeping your private key safe."
                    />
                    <FaqCard
                        question="Is there a file size limit?"
                        answer="Currently, we support files up to 2GB. For larger files, please contact support."
                    />
                </div>
            </div>
        </section>
    )
}

function FaqCard({ question, answer }) {
    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {question}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{answer}</p>
        </div>
    )
}
