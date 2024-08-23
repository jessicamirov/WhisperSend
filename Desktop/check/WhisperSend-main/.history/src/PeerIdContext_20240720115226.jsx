import { h, createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

export const PeerIdContext = createContext();

export const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
    });
    peer.on('connection', (conn) => {
      setConnection(conn);
      conn.on('data', (data) => {
        console.log('Received:', data);
      });
    });
  }, []);

  const recalculatePeerId = () => {
    const peer = new Peer();
    peer.on('open', (id) => {
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
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection, setConnection }}>
      {children}
    </PeerIdContext.Provider>
  );
};
