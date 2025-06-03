import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, AlignLeft, LogOut, Settings, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import authService from "../../services/auth.services.ts";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { totalItems, open } = useCart();
  // const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = authService.getCurrentUser()

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (authService.isAuthenticated()) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setShowUserMenu(false);
  };

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
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </button>
            
            {/* Desktop sidebar toggle */}
            <button
              onClick={onMenuClick}
              className="mr-4 hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:flex items-center"
              aria-label="Toggle sidebar"
            >
              <AlignLeft size={20} />
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
            
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                onClick={handleProfileClick}
                aria-label={authService.isAuthenticated() ? "View profile" : "Sign in"}
                className="hidden md:flex items-center"
              >
                {authService.isAuthenticated() ? (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      {user?.name.toUpperCase()}
                    </div>
                    <span className="ml-2 hidden lg:block">{user?.name}</span>
                  </div>
                ) : (
                  <User size={20} />
                )}
              </Button>
              
              {/* User dropdown menu */}
              {showUserMenu && authService.isAuthenticated() && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700"></div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Package size={16} className="mr-2" />
                    Orders
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-700"></div>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;