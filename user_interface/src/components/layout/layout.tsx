import { Outlet } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ShoppingCart from '../shop/ShoppingCart';
import { useCart } from '../../hooks/useCart';

const Layout = () => {
  const { isOpen } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'md:ml-64' : 'md:ml-16'
          }`}
        >
          <div className="p-6">
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
          <Footer />
        </main>
      </div>
      
      <ShoppingCart isOpen={isOpen} />
    </div>
  );
};

export default Layout;