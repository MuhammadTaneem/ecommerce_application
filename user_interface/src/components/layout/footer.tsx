import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-4">ModernShop</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your one-stop shop for modern, high-quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/man" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/products/woman" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="input flex-1"
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ModernShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;