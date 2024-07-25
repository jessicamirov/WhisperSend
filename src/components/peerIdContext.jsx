import { h, createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import Peer from "peerjs";

export const PeerIdContext = createContext();

export const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState(null);
  const [peerInstance, setPeerInstance] = useState(null); // להחזיק את מופע Peer

  useEffect(() => {
    const peer = new Peer();
    setPeerInstance(peer); // לשמור את מופע Peer

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      conn.on("open", () => {
        setConnection(conn);
      });

      conn.on("data", (data) => {
        console.log("Received:", data);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const recalculatePeerId = () => {
    const peer = new Peer();
    setPeerInstance(peer); // לשמור את מופע Peer החדש
    peer.on("open", (id) => {
      setPeerId(id);
    });
  };

  const connectToPeer = (id) => {
    if (peerInstance) {
      const conn = peerInstance.connect(id);
      conn.on("open", () => {
        setConnection(conn);
      });

      conn.on("data", (data) => {
        console.log("Received:", data);
      });
    } else {
      console.log("Peer instance not available");
    }
  };

  return (
    <PeerIdContext.Provider
      value={{ peerId, recalculatePeerId, connectToPeer, connection }}
    >
      {children}
    </PeerIdContext.Provider>
  );
};
