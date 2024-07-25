import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { FaPaperclip, FaSmile } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sendSound from "../assets/whisper.mp3";
import { PeerIdContext } from "../components/peerIdContext";
import ChatInstruction from "../components/chatInstruction";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages"; 

export default function ChatPage({ connectPeerId }) {
  const { peerId, connection } = useContext(PeerIdContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const playSendSound = () => {
    const audio = new Audio(sendSound);
    audio.play();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { type: "text", content: message, sender: peerId };
      setMessages([...messages, newMessage]);
      setMessage("");
      playSendSound();
      toast.success("Message sent!");
      if (connection) {
        console.log("Sending message:", newMessage);
        connection.send(newMessage);
      } else {
        console.log("No connection established");
      }
    }
  };

  const handleReceiveMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    playSendSound();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const confirmEncrypt = window.confirm(
        "Do you want to encrypt the file before sending?",
      );
      if (confirmEncrypt) {
        toast.info("File will be encrypted and sent.");
        // Add your file encryption logic here
      } else {
        toast.info("File will be sent without encryption.");
      }
    }
  };

  useEffect(() => {
    if (connection) {
      connection.on("data", (data) => {
        console.log("Received message:", data);
        handleReceiveMessage(data);
      });
    }
  }, [connection]);

  return (
    <ChatLayout peerId={peerId} connectPeerId={connectPeerId}>
      <div className="flex">
        <ChatInstruction />
        <div className="w-3/4 pl-4">
          <ChatMessages messages={messages} peerId={peerId} />{" "}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaPaperclip
              className="w-6 h-6 text-gray-500 cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <FaSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
            <button
              onClick={handleSendMessage}
              className="px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </ChatLayout>
  );
}
