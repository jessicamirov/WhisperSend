import { h, createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

export const PeerIdContext = createContext();

export const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState('');
  const [connection, setConnection] = useState(null);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', (id) => {
      setPeerId(id);
      setPeer(newPeer);
    });
    newPeer.on('connection', (conn) => {
      setConnection(conn);
      conn.on('data', (data) => {
        console.log('Received:', data);
      });
    });
  }, []);

  const recalculatePeerId = () => {
    const newPeer = new Peer();
    newPeer.on('open', (id) => {
      setPeerId(id);
      setPeer(newPeer);
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
