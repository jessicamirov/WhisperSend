export default function IntroductionSection() {
    return (
        <section
            id="home"
            className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-blue parallax"
            style={{
                backgroundImage: "url(/path-to-your-background-image.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                maxWidth: "80%", 
                margin: "0 auto", 
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
                At WhisperSend, we offer a simple and effective solution for
                file encryption and decryption,
            </p>
            <p className="text-xl mb-4 leading-relaxed drop-shadow-lg">
                so you can share your data with complete confidence and peace of
                mind.
            </p>
            <img src="/assets/LOGO.png" alt="WhisperSend Logo" className="w-1/4 max-w-[100px] md:max-w-[150px] lg:max-w-[200px]" />
        </section>
    );
}