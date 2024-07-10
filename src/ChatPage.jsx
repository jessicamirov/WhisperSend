import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FaSyncAlt } from 'react-icons/fa';
import inviteIcon from './assets/send1.png';

const ChatPage = ({ peerId, connectPeerId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { type: 'text', content: message, sender: 'user' }]);
      setMessage('');
    }
  };

  const handleSendFile = () => {
    if (file) {
      setMessages([...messages, { type: 'file', content: file.name, sender: 'user' }]);
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105 mb-8">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID:</p>
            <span className="text-2xl font-bold bg-gray-700 text-white px-4 py-2 rounded-lg">{peerId}</span>
            <div className="flex items-center space-x-4">
              <img src={inviteIcon} alt="Invite Icon" className="w-6 h-6 cursor-pointer" />
              <FaSyncAlt className="w-6 h-6 text-yellow-500 cursor-pointer" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">Secure Chat</h2>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 overflow-y-auto h-80 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-gray-900 mr-auto'}`}>
              {msg.type === 'text' ? (
                msg.content
              ) : (
                <a href="#" className="text-white underline">{msg.content}</a>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSendMessage} className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Send</button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSendFile} className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Encrypt File & Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
