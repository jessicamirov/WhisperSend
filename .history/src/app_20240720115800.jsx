import { h } from 'preact';
import { Router } from 'preact-router';
import Home from './Home';
import Encrypt from './Encrypt';
import Decrypt from './Decrypt';
import ShareSecurely from './ShareSecurely';
import ChatPage from './ChatPage';
import { PeerIdProvider } from './PeerIdContext';

const App = () => (
  <PeerIdProvider>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-gray-800 dark:bg-gray-900 text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold">
              WhisperSend
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="hover:underline">Home</a>
            <a href="/encrypt" className="hover:underline">Encrypt</a>
            <a href="/decrypt" className="hover:underline">Decrypt</a>
            <a href="/share-securely" className="hover:underline">Share Securely</a>
          </div>
        </nav>
      </header>
      <Router>
        <Home path="/" />
        <Encrypt path="/encrypt" />
        <Decrypt path="/decrypt" />
        <ShareSecurely path="/share-securely" />
        <ChatPage path="/chat/:connectPeerId" />
      </Router>
      <footer className="bg-blue-900 dark:bg-blue-700 text-white p-4 text-center">
        <p>&copy; 2024 WhisperSend. All rights reserved.</p>
      </footer>
    </div>
  </PeerIdProvider>
);

export default App;
