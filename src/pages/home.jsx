import { h } from "preact";
import { route } from "preact-router";

export default function Home() {
  return (
    <div>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-blue parallax"
        style={{
          backgroundImage: "url(/path-to-your-background-image.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-5xl font-bold mb-6 drop-shadow-lg">
          Encrypt and Decrypt Files with Ease
        </h2>
        <p className="text-xl mb-4 leading-relaxed drop-shadow-lg">
          Worried about sensitive data leaks?
        </p>
        <p className="text-xl mb-4 leading-relaxed drop-shadow-lg">
          Want to share files securely and privately?
        </p>
        <p className="text-xl mb-4 leading-relaxed drop-shadow-lg">
          At WhisperSend, we offer a simple and effective solution for file
          encryption and decryption,
        </p>
        <p className="text-xl mb-4 leading-relaxed drop-shadow-lg">
          so you can share your data with complete confidence and peace of mind.
        </p>
        <button
          className="px-8 py-4 mt-4 bg-white text-blue-500 font-bold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          onClick={() => route("/encrypt")}
        >
          Get Started
        </button>
      </section>
      <section
        id="features-overview"
        className="py-20 bg-gray-100 dark:bg-gray-800"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            Choose your desired action:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
              onClick={() => route("/encrypt")}
            >
              <img
                src="/src/assets/encrypt.png"
                alt="Encrypt Files"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Encrypt Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep your files on your device secure and protected from
                unauthorized access
              </p>
            </div>
            <div
              className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
              onClick={() => route("/decrypt")}
            >
              <img
                src="/src/assets/decrypt.png"
                alt="Decrypt Files"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Decrypt Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {" "}
                Only you can access your confidential files
              </p>
            </div>
            <div
              className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
              onClick={() => route("/share-securely")}
            >
              <img
                src="/src/assets/securechat.png"
                alt="Share Securely"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Secure Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chat and send files securely
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="testimonials" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <p className="text-gray-600 dark:text-gray-400">
                "WhisperSend is a game-changer! I can easily encrypt and share
                files with my team."
              </p>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                - Shay Zak
              </h3>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <p className="text-gray-600 dark:text-gray-400">
                "The encryption and decryption process is seamless. Highly
                recommend!"
              </p>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                - Shir Cohen
              </h3>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <p className="text-gray-600 dark:text-gray-400">
                "Excellent security features and easy to use interface."
              </p>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                - Ofek Golan
              </h3>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                How secure is WhisperSend?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The technologies we use ensure top-level security.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Is my data stored anywhere?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No, your data is not stored on our servers. It remains on your
                device, and only encrypted files are transmitted
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                What happens if I lose my private key?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unfortunately, without your private key, you will not be able to
                decrypt your files. We recommend keeping your private key safe.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Is there a file size limit?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Currently, we support files up to 2GB. For larger files, please
                contact support.
              </p>
            </div>
          </div>
        </div>
      </section>
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
    </div>
  );
}
