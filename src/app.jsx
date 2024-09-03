import Home from "./pages/home"
import Encrypt from "./pages/encrypt"
import Decrypt from "./pages/decrypt"
import ShareSecurely from "./pages/shareSecurely"
import ChatPage from "./pages/chatPage"
import Layout from "./components/layout"
import { Router } from "preact-router"
import { PeerIdProvider } from "./components/connectionManager"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function App() {
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
            {/* ToastContainer for displaying toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </PeerIdProvider>
    )
}
