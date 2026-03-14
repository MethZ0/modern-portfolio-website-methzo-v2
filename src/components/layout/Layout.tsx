import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showChrome?: boolean;
}

export function Layout({ children, showChrome = true }: LayoutProps) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {showChrome && <Header />}
      <main 
        id="main-content" 
        className={`flex-1 ${isHomepage ? '' : 'pt-16'}`}
        tabIndex={-1}
      >
        {children}
      </main>
      {showChrome && <Footer />}
    </div>
  );
}
