import { h } from "preact";
import { Router } from "preact-router";
import Home from "../pages/home";
import Encrypt from "../pages/encrypt";
import Decrypt from "../pages/decrypt";
import ShareSecurely from "../pages/shareSecurely";
import ChatPage from "../pages/chatPage";
import { PeerIdProvider } from "./peerIdContext";
import Layout from "./layout";

export default function App() {
  return (
    <PeerIdProvider>
      <Layout>
        <Router>
          <Home path="/" />
          <Encrypt path="/encrypt" />
          <Decrypt path="/decrypt" />
          <ShareSecurely path="/shareSecurely" />
          <ChatPage path="/chat/:connectPeerId" />
        </Router>
      </Layout>
    </PeerIdProvider>
  );
}
