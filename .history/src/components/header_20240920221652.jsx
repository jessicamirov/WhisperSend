import { useState, useEffect } from "preact/hooks"
import { Link } from "preact-router"

/**
 * Header component that displays a responsive navigation bar with links.
 * On large screens, it displays a horizontal navigation bar with links to different routes.
 * On smaller screens, it shows a toggleable side menu with navigation links.
 */

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false) 
    const [isLargeScreen, setIsLargeScreen] = useState(false) 

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024) 
        }

        handleResize() 
        window.addEventListener("resize", handleResize) 

        return () => {
            window.removeEventListener("resize", handleResize) 
        }
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            {isLargeScreen ? (
                <div className="bg-gray-800 dark:bg-gray-900 text-white p-4">
                    <nav className="container mx-auto flex justify-between">
                        <Link href="/" className="text-2xl font-bold">
                            WhisperSend
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="hover:underline text-slate-300 cursor-pointer"
                            >
                                Home
                            </Link>
                            <Link
                                href="/encrypt"
                                className="hover:underline text-slate-300 cursor-pointer"
                            >
                                Encrypt
                            </Link>
                            <Link
                                href="/decrypt"
                                className="hover:underline text-slate-300 cursor-pointer"
                            >
                                Decrypt
                            </Link>
                            <Link
                                href="/shareSecurely"
                                className="hover:underline text-slate-300 cursor-pointer"
                            >
                                Chat
                            </Link>
                        </div>
                    </nav>
                </div>
            ) : (
                <div className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">
                        WhisperSend
                    </Link>
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            )}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-800 dark:bg-gray-900 text-white w-64 p-6 transition-transform transform ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ zIndex: 1000 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Menu</h2>
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="flex flex-col space-y-4">
                    <Link
                        href="/"
                        className="hover:underline text-slate-300 cursor-pointer"
                    >
                        Home
                    </Link>
                    <Link
                        href="/encrypt"
                        className="hover:underline text-slate-300 cursor-pointer"
                    >
                        Encrypt
                    </Link>
                    <Link
                        href="/decrypt"
                        className="hover:underline text-slate-300 cursor-pointer"
                    >
                        Decrypt
                    </Link>
                    <Link
                        href="/shareSecurely"
                        className="hover:underline text-slate-300 cursor-pointer"
                    >
                        Chat
                    </Link>
                </nav>
            </div>

            {isMenuOpen && (
                <div
                    onClick={toggleMenu}
                    className="fixed inset-0 bg-black bg-opacity-50"
                    style={{ zIndex: 999 }}
                />
            )}
        </>
    )
}
