// IntroductionSection.jsx
import { h } from "preact";
import { route } from "preact-router";

export default function IntroductionSection() {
  return (
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
  );
}
