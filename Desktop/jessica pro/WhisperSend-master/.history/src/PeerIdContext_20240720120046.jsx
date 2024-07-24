import { createContext, useState, useEffect } from 'preact';
import Peer from 'peerjs';

const PeerIdContext = createContext();

const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const recalculatePeerId = () => {
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
    });
  };

  const connectToPeer = (connectPeerId) => {
    if (!peerId) return;

    const peer = new Peer(peerId);
    const conn = peer.connect(connectPeerId);
    conn.on('open', () => {
      setConnection(conn);
    });

    conn.on('data', (data) => {
      // handle incoming data
    });
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection, setConnection }}>
      {children}
    </PeerIdContext.Provider>
  );
};

export { PeerIdProvider, PeerIdContext };
