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
        // Handle incoming data
        console.log('Received data:', data);
      });
    });

    return () => peer.destroy();
  }, []);

  const recalculatePeerId = () => {
    const peer = new Peer();
    peer.on('open', id => {
      setPeerId(id);
    });
  };

  const connectToPeer = (id) => {
    const conn = peer.connect(id);
    setConnection(conn);
    conn.on('open', () => {
      console.log('Connection opened');
    });
    conn.on('data', data => {
      console.log('Received data:', data);
    });
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection }}>
      {children}
    </PeerIdContext.Provider>
  );
};

export { PeerIdProvider, PeerIdContext };
