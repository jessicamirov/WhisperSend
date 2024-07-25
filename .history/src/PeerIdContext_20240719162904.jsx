import { createContext, useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

const PeerIdContext = createContext();

const PeerIdProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const peerInstance = new Peer();
    setPeer(peerInstance);

    peerInstance.on('open', (id) => {
      setPeerId(id);
    });

    peerInstance.on('connection', (conn) => {
      setConnection(conn);
      conn.on('data', (data) => {
        console.log('Received data:', data);
      });
    });

    return () => peerInstance.destroy();
  }, []);

  const recalculatePeerId = () => {
    peer?.destroy();
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on('open', (id) => {
      setPeerId(id);
    });

    newPeer.on('connection', (conn) => {
      setConnection(conn);
      conn.on('data', (data) => {
        console.log('Received data:', data);
      });
    });
  };

  const connectToPeer = (peerIdToConnect) => {
    const conn = peer.connect(peerIdToConnect);
    setConnection(conn);
    conn.on('open', () => {
      console.log('Connection opened');
    });
    conn.on('data', (data) => {
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
