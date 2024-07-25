import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Decrypt() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setIsDecrypted(false);
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    setMessage('');
    setIsDecrypted(false);
  };

  const handleDecrypt = () => {
    // Add your decryption logic here
    setIsDecrypted(true);
    setMessage('File decrypted successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105 mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">Self-Decryption</h2>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Upload an encrypted file:</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Encryption Key:</label>
          <input 
            type="text" 
            value={key} 
            onChange={handleKeyChange} 
            className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleDecrypt} 
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
        >
          Decrypt
        </button>
        {message && (
          <p className="mt-6 text-green-500 text-lg font-semibold">{message}</p>
        )}
        {isDecrypted && (
          <div className="mt-6 space-y-4">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 transition duration-300">
              Download Decrypted File
            </button>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How Decryption Works</h3>
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-6">
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-blue-500">1</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Upload an encrypted file</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Choose an encrypted file to decrypt using the "Upload an encrypted file" button.</p>
          </div>
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-green-500">2</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Enter encryption key</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Enter the encryption key to decrypt the file.</p>
          </div>
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-yellow-500">3</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Decrypt</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Click the "Decrypt" button to decrypt the file.</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="step-circle bg-red-500">4</div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Download decrypted file</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Download the decrypted file once the decryption is complete.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
