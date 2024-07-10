import { h } from 'preact';
import { useState } from 'preact/hooks';

const Encrypt = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setIsEncrypted(false);
  };

  const handleEncrypt = () => {
    // Add your encryption logic here
    setIsEncrypted(true);
    setMessage('File encrypted successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105 mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">Self-Encryption</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Choose a file:</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleEncrypt} 
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
        >
          Encrypt & Save
        </button>
        {message && (
          <p className="mt-6 text-green-500 text-lg font-semibold">{message}</p>
        )}
        {isEncrypted && (
          <div className="mt-6 space-y-4">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 transition duration-300">
              Download Encrypted File
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300">
              Download Keys
            </button>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How Encryption Works</h3>
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-6">
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-blue-500">1</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Select a file</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Choose a file to encrypt using the "Choose a file" button.</p>
          </div>
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-green-500">2</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Encrypt</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Click the "Encrypt & Save" button to encrypt the file.</p>
          </div>
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-yellow-500">3</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Save file and keys</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Download the encrypted file and the encryption keys. Without the keys, you cannot decrypt the file in the future.</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-red-500">4</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Store securely</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Store the encryption keys securely to ensure you can access your files when needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
