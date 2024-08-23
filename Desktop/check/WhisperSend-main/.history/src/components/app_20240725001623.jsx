import { h } from 'preact';
import { Router } from 'preact-router';
import ShareSecurely from './shareSecurely';
import ChatPage from './chatPage';
import Layout from './layout';
import PeerIdProvider from './peerIdContext';

const App = () => {
  return (
    <PeerIdProvider>
      <Layout>
        <Router>
          <ShareSecurely path="/" />
          <ChatPage path="/chat/:peerId" />
        </Router>
      </Layout>
    </PeerIdProvider>
  );
};

export default App;
