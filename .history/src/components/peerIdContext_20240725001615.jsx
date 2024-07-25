import { createContext } from 'preact';
import { useState } from 'preact/hooks';

export const PeerIdContext = createContext();

export default function PeerIdProvider({ children }) {
  const [peerId, setPeerId] = useState('default-peer-id');

  const recalculatePeerId = () => {
    setPeerId('new-peer-id');
  };

  const connectToPeer = (id) => {
    console.log(`Connecting to peer: ${id}`);
  };

  return (
    <PeerIdContext.Provider value={{ peerId, recalculatePeerId, connectToPeer }}>
      {children}
    </PeerIdContext.Provider>
  );
}
