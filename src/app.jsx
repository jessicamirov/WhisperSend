import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router } from 'preact-router';
import Home from './Home';
import Encrypt from './Encrypt';
import Decrypt from './Decrypt';
import ShareSecurely from './ShareSecurely';
import logo from './assets/image.png'; // Ensure the path is correct
import './index.css'; // Correct path to the CSS file

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`bg-gray-100 min-h-screen ${darkMode ? 'dark:bg-gray-900' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center fixed w-full z-10">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="WhisperSend Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-200">WhisperSend</h1>
        </div>
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 transition duration-300">Home</a>
          <a href="/encrypt" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 transition duration-300">Encrypt</a>
          <a href="/decrypt" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 transition duration-300">Decrypt</a>
          <a href="/share-securely" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 transition duration-300">Secure Chat</a>
          <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 transition duration-300">Contact</a>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </header>
      <main className="pt-16">
        <Router>
          <Home path="/" />
          <Encrypt path="/encrypt" />
          <Decrypt path="/decrypt" />
          <ShareSecurely path="/share-securely" />
        </Router>
      </main>
      <footer className="bg-blue-900 dark:bg-blue-700 text-white p-4 text-center">
        <p>&copy; 2024 WhisperSend. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
