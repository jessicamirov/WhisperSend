import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

const PeerIdContext = createContext();

const PeerIdProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', id => {
      setPeerId(id);
    });

    newPeer.on('connection', conn => {
      setConnection(conn);
      conn.on('data', data => {
        console.log('Received', data);
      });
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const recalculatePeerId = () => {
    const newPeer = new Peer();
    newPeer.on('open', id => {
      setPeerId(id);
    });

    setPeer(newPeer);
  };

  const connectToPeer = (connectPeerId) => {
    if (peer) {
      const conn = peer.connect(connectPeerId);

      conn.on('open', () => {
        setConnection(conn);
        conn.on('data', data => {
          console.log('Received', data);
        });
      });

      conn.on('error', err => {
        console.error('Connection error:', err);
      });
    }
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection }}>
      {children}
    </PeerIdContext.Provider>
  );
};

export { PeerIdProvider, PeerIdContext };
