import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { totalItems, open } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                ModernShop
              </span>
            </Link>
            
            <nav className="ml-8 hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Products
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search products..."
                  className="input pl-10 pr-4 py-1.5 w-full sm:w-64"
                />
              </div>
            </div>
            
            <ThemeToggle />
            
            <Button
              variant="ghost"
              className="relative"
              onClick={open}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white dark:bg-primary-500">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <div className="hidden md:block">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;