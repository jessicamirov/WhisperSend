import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
