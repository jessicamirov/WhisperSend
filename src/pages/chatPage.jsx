// chatPage.jsx
import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sendSound from "../assets/whisper.mp3";
import { PeerIdContext } from "../components/peerIdContext";
import ChatInstruction from "../components/chatInstruction";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput"; 

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
          <ChatMessages messages={messages} peerId={peerId} />
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleFileChange={handleFileChange}
          />{" "}
        </div>
      </div>
      <ToastContainer />
    </ChatLayout>
  );
}
