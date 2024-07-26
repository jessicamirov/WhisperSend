import { h } from "preact";

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
          Contact Us
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Have any questions? Get in touch with us and we will be happy to
          assist you.
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          <textarea
            placeholder="Message"
            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 md:col-span-2"
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 md:col-span-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
