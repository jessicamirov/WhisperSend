import { h } from 'preact';
import Header from './header';
import Footer from './footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
