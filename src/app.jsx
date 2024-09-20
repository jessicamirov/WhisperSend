import Home from "./pages/home"
import Encrypt from "./pages/encrypt"
import Decrypt from "./pages/decrypt"
import ShareSecurely from "./pages/shareSecurely"
import ChatPage from "./pages/chatPage"
import Layout from "./components/layout"
import { Router } from "preact-router"
import { PeerIdProvider, PeerIdContext } from "./components/peerIdContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MnemonicPopup from "./utils/mnemonicPopup"
import { useEffect, useState, useContext } from "preact/hooks"

export function App() {
    const peerContext = useContext(PeerIdContext)
    const myWallet = peerContext?.myWallet || null
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(true)
        const [currentPath, setCurrentPath] = useState("")


    useEffect(() => {
        if (myWallet) {
            setShowMnemonicPopup(true)
        }
    }, [myWallet])

    const handleRouteChange = (e) => {
        setCurrentPath(e.url)
    }

    const handleConfirmMnemonic = () => {
        setShowMnemonicPopup(false)
    }

    return (
        <PeerIdProvider>
            <Layout>
                <Router onChange={handleRouteChange}>
                    <Home path="/" />
                    <Encrypt
                        path="/encrypt"
                        showMnemonicPopup={showMnemonicPopup}
                        onConfirmMnemonic={handleConfirmMnemonic}
                    />
                    <Decrypt
                        path="/decrypt"
                        showMnemonicPopup={showMnemonicPopup}
                        onConfirmMnemonic={handleConfirmMnemonic}
                    />
                    <ShareSecurely
                        path="/shareSecurely"
                        showMnemonicPopup={showMnemonicPopup}
                        onConfirmMnemonic={handleConfirmMnemonic}
                    />

                    <ChatPage path="/chat/:connectPeerId" />
                </Router>
            </Layout>

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
