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


/**
 * The `App` component serves as the main entry point of the application, managing routing, 
 * user context, and layout. It integrates peer-to-peer wallet context (via PeerIdProvider) 
 * and displays mnemonic key recovery popups if needed. 
 * 
 * Features:
 * Provides the main structure of the application, including layout and routing.
 * Displays popup for mnemonic recovery when the user’s wallet is detected.
 * Handles notifications with a customizable `ToastContainer`.
 */

export function App() {
    const peerContext = useContext(PeerIdContext)
    const myWallet = peerContext?.myWallet || null
    // State to control visibility of mnemonic popup once per session .
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(true)
    const [currentPath, setCurrentPath] = useState("")

    // This hook listens for changes in the `myWallet` value.
    // If the user's wallet is detected, the mnemonic popup is triggered.  
    useEffect(() => {
        if (myWallet) {
            setShowMnemonicPopup(true)
        }
    }, [myWallet])

    // updates the `currentPath` state based on route changes.
    const handleRouteChange = (e) => {
        setCurrentPath(e.url)
    }

    //handle the confirmation of the mnemonic popup.
    // Once confirmed, the popup is hidden.
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
