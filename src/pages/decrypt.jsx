// decrypt.jsx

import React, { useReducer, useContext } from "react"
import { ethers } from "ethers"
import { decryptFile } from "../utils/encryption" // ייבוא הפונקציה מקובץ ההצפנה
import { Context } from "../utils/context" // ייבוא הקשר (context) שלך
import { reducer, InitState } from "../utils/reducer" // ייבוא reducer ו-InitState

export default function Decrypt() {
    const { state: globalState } = useContext(Context)
    const { myWallet } = globalState

    const [state, dispatch] = useReducer(reducer, InitState)

    const handleFileChange = (e) => {
        dispatch({ type: "SET_FILE", payload: e.target.files[0] })
    }

    const handleDecrypt = async () => {
        if (!state.file) return

        dispatch({
            type: "SET_LOADING",
            payload: true,
        })

        dispatch({
            type: "SET_MESSAGE",
            payload: "Decrypting file, please wait...",
        })

        try {
            const wallet = state.useCustomMnemonic
                ? ethers.Wallet.fromPhrase(state.mnemonic)
                : myWallet

            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const encryptedFile = Buffer.from(reader.result).toString()
                    console.log("Encrypted file content:", encryptedFile)

                    const decryptedURL = decryptFile(
                        encryptedFile,
                        wallet.publicKey,
                        wallet.privateKey,
                    )

                    if (decryptedURL) {
                        const originalFileName = state.file.name.replace(
                            ".encrypted",
                            "",
                        )
                        const link = document.createElement("a")
                        link.href = decryptedURL
                        link.download = originalFileName
                        link.click()

                        dispatch({ type: "SET_DECRYPTED", payload: true })
                        dispatch({
                            type: "SET_MESSAGE",
                            payload: "File decrypted successfully!",
                        })
                    } else {
                        dispatch({
                            type: "SET_MESSAGE",
                            payload:
                                "Decryption failed. Please check your mnemonic or file.",
                        })
                    }
                } catch (error) {
                    console.error("Error during file decryption:", error)
                    dispatch({
                        type: "SET_MESSAGE",
                        payload: "Decryption failed. Invalid file format.",
                    })
                } finally {
                    dispatch({ type: "SET_LOADING", payload: false })
                }
            }

            reader.readAsArrayBuffer(state.file)
        } catch (error) {
            console.error("Error during decryption:", error)
            dispatch({
                type: "SET_MESSAGE",
                payload: "An error occurred during decryption.",
            })
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl transform transition duration-500 hover:scale-105 mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
                    Self-Decryption
                </h2>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Upload an encrypted file:
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Use custom mnemonic:
                    </label>
                    <input
                        type="checkbox"
                        checked={state.useCustomMnemonic}
                        onChange={() =>
                            dispatch({ type: "TOGGLE_CUSTOM_MNEMONIC" })
                        }
                        className="mr-2"
                    />
                </div>
                {state.useCustomMnemonic && (
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Mnemonic Phrase:
                        </label>
                        <input
                            type="text"
                            value={state.mnemonic}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_MNEMONIC",
                                    payload: e.target.value,
                                })
                            }
                            className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
                <button
                    onClick={handleDecrypt}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
                >
                    Decrypt
                </button>
                {state.message && (
                    <p className="mt-6 text-green-500 text-lg font-semibold">
                        {state.message}
                    </p>
                )}
            </div>
        </div>
    )
}
