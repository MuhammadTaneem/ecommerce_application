import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingCartProps {
  isOpen: boolean;
}

const ShoppingCart = ({ isOpen }: ShoppingCartProps) => {
  const {
    items,
    totalItems,
    totalPrice,
    close,
    removeItem,
    updateItemQuantity,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Prevent scrolling when cart is open
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={close}
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-800 sm:max-w-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={close}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
            
            {items.length === 0 ? (
              <div className="mt-20 flex flex-col items-center justify-center text-center">
                <ShoppingBag size={64} className="text-gray-300 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button
                  onClick={close}
                  className="mt-8"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="mt-8 flex h-full flex-col">
                <div className="flex-1">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.productId}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="py-6"
                        >
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium">
                                  <h3 className="line-clamp-1">
                                    <Link
                                      to={`/product/${item.productId}`}
                                      className="hover:text-primary-600 dark:hover:text-primary-400"
                                      onClick={close}
                                    >
                                      {item.name}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() => updateItemQuantity(
                                      item.productId,
                                      Math.max(1, item.quantity - 1)
                                    )}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateItemQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.productId)}
                                  className="text-gray-500 hover:text-red-500 dark:text-gray-400"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <div className="flex justify-between text-base font-medium">
                    <p>Subtotal ({totalItems} items)</p>
                    <p>{formatPrice(totalPrice)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Shipping and taxes calculated at checkout
                  </p>
                  
                  <div className="mt-6">
                    <Link
                      to="/cart"
                      onClick={close}
                      className="btn btn-primary w-full"
                    >
                      Checkout
                    </Link>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={close}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;