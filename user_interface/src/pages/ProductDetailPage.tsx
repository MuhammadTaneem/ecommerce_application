import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSelectedProduct } from '../store/slices/productSlice';
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { products, selectedProduct, loading } = useSelector((state: RootState) => state.products);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    if (id) {
      const product = products.find((p) => p.id === Number(id));
      if (product) {
        dispatch(setSelectedProduct(product));
      }
    }
    
    return () => {
      dispatch(setSelectedProduct(null));
    };
  }, [id, products, dispatch]);
  
  if (loading || !selectedProduct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addItem(selectedProduct, quantity);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div>
      <Link 
        to="/products" 
        className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>
      
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800">
        <div className="grid md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="aspect-square overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          
          <div className="p-6 lg:col-span-2">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {selectedProduct.name}
            </h1>
            
            <div className="mb-4 flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-5 w-5 ${
                    i < selectedProduct.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({selectedProduct.rating.toFixed(1)})
              </span>
            </div>
            
            <p className="mb-6 text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(selectedProduct.price)}
            </p>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {selectedProduct.description}
            </p>
            
            <div className="mb-6">
              <p className="mb-2 font-medium">Quantity</p>
              <div className="flex w-32 items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center border-r hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-10 w-12 border-none text-center focus:outline-none dark:bg-gray-800"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center border-l hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                disabled={!selectedProduct.inStock}
              >
                <ShoppingCart size={16} className="mr-2" />
                {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" aria-label="Add to wishlist">
                <Heart size={16} />
              </Button>
              <Button variant="outline" aria-label="Share product">
                <Share2 size={16} />
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <p className="mb-2 font-medium">Category</p>
              <Link
                to={`/products/${selectedProduct.category}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {selectedProduct.category
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;