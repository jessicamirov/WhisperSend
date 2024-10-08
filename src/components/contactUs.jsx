import { useState } from "preact/hooks"
import emailjs from "emailjs-com"

/**
 * ContactUs component provides a contact form for users to send messages via email.
 * It Uses the `emailjs-com` library to send the form data via email.
 */

export default function ContactUs() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState("")

    // Handles form submission, sends email using emailjs, and resets the form
    const handleSubmit = (e) => {
        e.preventDefault()
        const templateParams = {
            name,
            email,
            message,
        }

        emailjs
            .send(
                "service_amnfo81",// emailjs service ID
                "template_zitelyq",// emailjs template ID
                templateParams,
                "9RtmPNARIFbNV1ms1", // emailjs user ID
            )
            .then(
                (response) => {
                    setStatus("Message sent successfully!")
                },
                (err) => {
                    console.error("FAILED...", err)
                    setStatus("Failed to send message. Please try again later.")
                },
            )

         // Reset form fields
        setName("")
        setEmail("")
        setMessage("")
    }

    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    Contact Us
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Have any questions? Get in touch with us and we will be
                    happy to assist you.
                </p>
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        required
                    />
                    <textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 md:col-span-2"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 md:col-span-2"
                    >
                        Send Message
                    </button>
                </form>
                {status && <p className="mt-4 text-green-500">{status}</p>}{" "}
            </div>
        </section>
    )
}
