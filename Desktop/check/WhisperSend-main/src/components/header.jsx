import { Link } from "preact-router";

export default function Header() {
  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white p-4">
      <nav className="container mx-auto flex justify-between">
          <Link href="/" className="text-2xl font-bold">WhisperSend</Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:underline text-slate-300 cursor-pointer">Home</Link>
          <Link href="/encrypt" className="hover:underline text-slate-300 cursor-pointer">Encrypt</Link>
          <Link href="/decrypt" className="hover:underline text-slate-300 cursor-pointer">Decrypt</Link>
          <Link href="/shareSecurely" className="hover:underline text-slate-300 cursor-pointer">Chat</Link>
        </div>
      </nav>
    </div>
  );
}
