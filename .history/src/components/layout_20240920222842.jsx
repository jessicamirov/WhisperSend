import Header from "./header"
import Footer from "./footer"

/**
 * This component acts as the main layout wrapper for the application.
 * It includes the header at the top, the main content,
 * and the footer at the bottom.
 * 
 * Header: Displays the navigation bar for the site.
 * Footer: Displays the footer with additional site information.
 */

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
