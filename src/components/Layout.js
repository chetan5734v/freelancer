import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, showHeader = true, showFooter = true, background = 'white' }) {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200',
    white: 'bg-white',
    dark: 'bg-gray-900'
  };

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClasses[background]}`}>
      {showHeader && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;
