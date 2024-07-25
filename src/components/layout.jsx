import { h, Fragment } from "preact";
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <Fragment>
      <Header />
      <main className="container mx-auto p-4">{children}</main>
      <Footer />
    </Fragment>
  );
}
