// reducer.js

export const InitState = {
    peer: null,
    connection: null,
    myWallet: null,
    peerId: "",
    recipient: null,
    recipientPeerId: "",
    messages: [],
    message: "",
    file: null, // ניהול קובץ שנבחר
    mnemonic: "", // ניהול ביטוי מנמוניק מותאם אישית
    useCustomMnemonic: false, // אם להשתמש במנמוניק מותאם אישית
    isDecrypted: false, // ניהול מצב הפענוח
    isLoading: false, // ניהול מצב טעינה
}

export const reducer = (state, action) => {
    console.log("Reducer action:", action) // Debugging line
    switch (action.type) {
        // פעולות קיימות
        case "SET_PEER":
            console.log("Setting peer:", action.payload)
            return { ...state, peer: action.payload }
        case "SET_CONNECTION":
            console.log("Setting connection:", action.payload)
            return { ...state, connection: action.payload }
        case "SET_WALLET":
            console.log("Setting wallet:", action.payload)
            return { ...state, myWallet: action.payload }
        case "SET_PEER_ID":
            console.log("Setting peer ID:", action.payload)
            return { ...state, peerId: action.payload }
        case "SET_RECIPIENT":
            console.log("Setting recipient:", action.payload)
            return { ...state, recipient: action.payload }
        case "SET_RECIPIENT_PEER_ID":
            console.log("Setting recipient peer ID:", action.payload)
            return { ...state, recipientPeerId: action.payload }
        case "SET_MESSAGE":
            return { ...state, message: action.payload }
        case "SET_MESSAGES":
            return { ...state, messages: action.payload }
        case "RESET_STATE":
            console.log("Resetting state")
            return {
                ...InitState, // איפוס כללי
            }
        case "CONNECT_PEER":
            if (state.peer) {
                const con = state.peer.connect(action.payload)
                console.log("Connection established to peer:", action.payload)
                return {
                    ...state,
                    connection: con,
                    recipientPeerId: action.payload,
                }
            } else {
                console.error("Peer not initialized.")
                return state
            }

        // פעולות חדשות עבור פענוח
        case "SET_FILE":
            return {
                ...state,
                file: action.payload,
                message: "",
                isDecrypted: false,
            }
        case "SET_MNEMONIC":
            return { ...state, mnemonic: action.payload }
        case "TOGGLE_CUSTOM_MNEMONIC":
            return { ...state, useCustomMnemonic: !state.useCustomMnemonic }
        case "SET_DECRYPTED":
            return { ...state, isDecrypted: action.payload }
        case "SET_LOADING":
            return { ...state, isLoading: action.payload }

        default:
            return state
    }
}
