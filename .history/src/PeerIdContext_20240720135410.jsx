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
      conn.on('open', () => {
        setConnection(conn);
      });

      conn.on('data', (data) => {
        console.log('Received:', data);
      });
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

  const connectToPeer = (id) => {
    const conn = peer.connect(id);
    conn.on('open', () => {
      setConnection(conn);
    });

    conn.on('data', (data) => {
      console.log('Received:', data);
    });
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer, connection }}>
      {children}
    </PeerIdContext.Provider>
  );
};
