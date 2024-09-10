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
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(false)
    const [currentPath, setCurrentPath] = useState("")
    const [isLoadingMnemonic, setIsLoadingMnemonic] = useState(true)

    useEffect(() => {
        const isMnemonicSaved = sessionStorage.getItem("mnemonicSaved")
        const isMnemonicConfirmed = sessionStorage.getItem("mnemonicConfirmed")

        // אם זה טעינת עמוד מחדש - איפוס נתונים
        if (
            performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
            console.log("Page reload detected, clearing sessionStorage.")
            sessionStorage.removeItem("mnemonicSaved")
            sessionStorage.removeItem("mnemonicConfirmed")
        }

        console.log("Mnemonic saved in sessionStorage:", isMnemonicSaved)
        console.log(
            "Mnemonic confirmed in sessionStorage:",
            isMnemonicConfirmed,
        )
        console.log("Current path:", currentPath)

        // בדיקת סטטוס שמירת ה-mnemonic
        if (myWallet?.mnemonic?.phrase) {
            if (!isMnemonicSaved && !isMnemonicConfirmed) {
                console.log(
                    "No saved mnemonic in sessionStorage. Showing MnemonicPopup.",
                )
                const validPaths = [
                    "/encrypt",
                    "/decrypt",
                    "/shareSecurely",
                    "/chat",
                ]
                if (validPaths.some((path) => currentPath.startsWith(path))) {
                    console.log("Valid path detected. Showing MnemonicPopup.")
                    setShowMnemonicPopup(true)
                }
            } else {
                console.log(
                    "Mnemonic already confirmed. No need to show the popup.",
                )
            }
            setIsLoadingMnemonic(false)
        } else {
            console.log("Waiting for myWallet...")
        }
    }, [currentPath, myWallet])

    const handleConfirmMnemonic = () => {
        console.log("Mnemonic confirmed by user.")
        sessionStorage.setItem("mnemonicSaved", "true")
        sessionStorage.setItem("mnemonicConfirmed", "true")
        setShowMnemonicPopup(false)
    }

    const handleRouteChange = (e) => {
        console.log("Route changed to:", e.url)
        setCurrentPath(e.url)
    }

    return (
        <PeerIdProvider>
            <Layout>
                <Router onChange={handleRouteChange}>
                    <Home path="/" />
                    <Encrypt path="/encrypt" />
                    <Decrypt path="/decrypt" />
                    <ShareSecurely path="/shareSecurely" />
                    <ChatPage path="/chat/:connectPeerId" />
                </Router>
            </Layout>
            {/* הצגת ה-popup של ה-Mnemonic רק אם לא נטען קודם */}
            {showMnemonicPopup && !isLoadingMnemonic && myWallet && (
                <MnemonicPopup
                    mnemonic={myWallet.mnemonic.phrase}
                    onConfirm={handleConfirmMnemonic}
                />
            )}

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
