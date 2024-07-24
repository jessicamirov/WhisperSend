import { h } from 'preact';
import { createContext, useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

const PeerIdContext = createContext();

const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', id => {
      setPeerId(id);
    });
    peer.on('connection', conn => {
      setConnection(conn);
      conn.on('data', data => {
        console.log('Received:', data);
      });
    });
  }, []);

  const recalculatePeerId = () => {
    const peer = new Peer();
    peer.on('open', id => {
      setPeerId(id);
    });
  };

  const connectToPeer = (id) => {
    const conn = peer.connect(id);
    conn.on('open', () => {
      setConnection(conn);
    });
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection }}>
      {children}
    </PeerIdContext.Provider>
  );
};

export { PeerIdProvider, PeerIdContext };
