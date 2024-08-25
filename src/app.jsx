import Home from "./pages/home"
import Encrypt from "./pages/encrypt"
import Decrypt from "./pages/decrypt"
import ShareSecurely from "./pages/shareSecurely"
import ChatPage from "./pages/chatPage"
import Layout from "./components/layout"
import { Router } from "preact-router"
import { Context } from "./utils/context"
import { InitState, reducer } from "./utils/reducer"
import ConnectionManager from "./components/connectionManager" 
import { useReducer } from "preact/hooks"

export function App() {
    const [state, dispatch] = useReducer(reducer, InitState)

    return (
        <Context.Provider value={{ state, dispatch }}>
            <ConnectionManager>
                {" "}
                <Layout>
                    <Router>
                        <Home path="/" />
                        <Encrypt path="/encrypt" />
                        <Decrypt path="/decrypt" />
                        <ShareSecurely path="/shareSecurely" />
                        <ChatPage path="/chat/:connectPeerId" />
                    </Router>
                </Layout>
            </ConnectionManager>
        </Context.Provider>
    )
}
