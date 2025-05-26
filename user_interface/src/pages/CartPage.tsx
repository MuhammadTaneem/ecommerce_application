import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateItemQuantity,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products" className="mt-8">
          <Button>
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Cart Items ({totalItems})
              </h2>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.productId} className="py-6 first:pt-0 last:pb-0">
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
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium">
                              <Link
                                to={`/product/${item.productId}`}
                                className="hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {item.name}
                              </Link>
                            </h3>
                            <p className="text-base font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-500 hover:text-red-500 dark:text-gray-400"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>Calculated at checkout</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>Calculated at checkout</p>
                </div>
                
                <div className="my-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-bold">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>
                
                <Button fullWidth>
                  Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Have a coupon?</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="input rounded-r-none flex-1"
              />
              <Button className="rounded-l-none">Apply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;