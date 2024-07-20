import { h } from 'preact';
import { useState, useContext, useEffect } from 'preact/hooks';
import { FaPaperclip, FaSmile } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sendSound from './assets/whisper.mp3';
import { PeerIdContext } from './PeerIdContext'; 
import { useRouter } from 'preact-router';

const ChatPage = ({ connectPeerId }) => {
  const { peerId, connection } = useContext(PeerIdContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const playSendSound = () => {
    const audio = new Audio(sendSound);
    audio.play();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { type: 'text', content: message, sender: 'user' };
      setMessages([...messages, newMessage]);
      setMessage('');
      playSendSound();
      toast.success('Message sent!');
      if (connection) {
        connection.send(newMessage);
      }
    }
  };

  const handleReceiveMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
    playSendSound(); 
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const confirmEncrypt = window.confirm('Do you want to encrypt the file before sending?');
      if (confirmEncrypt) {
        toast.info('File will be encrypted and sent.');
        // Add your file encryption logic here
      } else {
        toast.info('File will be sent without encryption.');
      }
    }
  };

  useEffect(() => {
    if (connection) {
      connection.on('data', handleReceiveMessage);
    }
  }, [connection]);

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center space-x-2 mb-8">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">User's Peer ID:</p>
        <span className="text-2xl font-bold bg-gray-700 text-white px-4 py-2 rounded-lg">{peerId}</span>
      </div>
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-8">
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center space-x-2">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">You are chatting with peer:</p>
            <span className="text-2xl font-bold bg-gray-700 text-white px-4 py-2 rounded-lg">{connectPeerId}</span>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/4 pr-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl h-full">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">How Secure Chat Works</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="step-circle bg-blue-500">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Connect</h4>
                    <p className="text-gray-600 dark:text-gray-400">Enter peer ID and click 'Connect'.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="step-circle bg-green-500">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Message</h4>
                    <p className="text-gray-600 dark:text-gray-400">Type and send your message.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="step-circle bg-yellow-500">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Send File</h4>
                    <p className="text-gray-600 dark:text-gray-400">Click paperclip to select a file.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="step-circle bg-red-500">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Encrypt</h4>
                    <p className="text-gray-600 dark:text-gray-400">Click 'Encrypt & Send' to send file.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="step-circle bg-purple-500">
                    <span className="text-white font-bold text-xl">5</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Decrypt</h4>
                    <p className="text-gray-600 dark:text-gray-400">Click 'Decrypt' to view received file.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4 pl-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 overflow-y-auto h-96 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-gray-900 mr-auto'}`}
                  style={{
                    maxWidth: '75%',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{msg.sender === 'user' ? 'You' : 'Peer'}</span>
                    <span>{msg.type === 'text' ? msg.content : <a href="#" className="text-white underline">{msg.content}</a>}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaPaperclip className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => document.getElementById('fileInput').click()} />
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <FaSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
              <button onClick={handleSendMessage} className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Send</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatPage;
