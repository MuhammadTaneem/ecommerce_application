import { Outlet } from 'react-router-dom';
import { Suspense, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ShoppingCart from '../shop/ShoppingCart';
import { useCart } from '../../hooks/useCart';

const Layout = () => {
  const { isOpen } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1">
          <div className="container-custom py-8">
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      
      <Footer />
      
      <ShoppingCart isOpen={isOpen} />
    </div>
  );
};

export default Layout;