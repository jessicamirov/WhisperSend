import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Peer from 'peerjs';

const PeerIdContext = createContext();

const PeerIdProvider = ({ children }) => {
  const [peerId, setPeerId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [peerInstance, setPeerInstance] = useState(null);

  useEffect(() => {
    const peer = new Peer();
    setPeerInstance(peer);
    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        setConnection(conn);
      });

      conn.on('data', (data) => {
        console.log('Received data:', data);
        setConnection(conn);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const recalculatePeerId = () => {
    if (peerInstance) {
      peerInstance.destroy();
    }
    const peer = new Peer();
    setPeerInstance(peer);
    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        setConnection(conn);
      });

      conn.on('data', (data) => {
        console.log('Received data:', data);
        setConnection(conn);
      });
    });
  };

  const connectToPeer = (connectPeerId) => {
    if (peerInstance) {
      const conn = peerInstance.connect(connectPeerId);
      conn.on('open', () => {
        setConnection(conn);
      });

      conn.on('data', (data) => {
        console.log('Received data:', data);
        setConnection(conn);
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
