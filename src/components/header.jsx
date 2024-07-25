import { h } from "preact";

export default function Header() {
  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold">
            WhisperSend
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/encrypt" className="hover:underline">
            Encrypt
          </a>
          <a href="/decrypt" className="hover:underline">
            Decrypt
          </a>
          <a href="/shareSecurely" className="hover:underline">
            Chat
          </a>
        </div>
      </nav>
    </div>
  );
}
