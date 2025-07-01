import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/shop/ProductCard';
import { ArrowRight, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { ProductType } from '../types/index';
import { toast } from '../hooks/use-toast';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Flash sale data
  const flashSale = {
    name: "Summer Special Flash Sale",
    description: "Get up to 50% off on selected items. Limited time offer!",
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    startDate: new Date('2024-03-20T00:00:00'),
    endDate: new Date('2024-03-25T23:59:59'),
    is_published: true
  };

  // Calculate time left for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(flashSale.endDate);
      const start = new Date(flashSale.startDate);
      
      let targetDate = now < start ? start : end;
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setProducts(data);
        setTrendingProducts(data.slice(0, 4)); // Only show first 4 products as trending
      } else {
        throw new Error('Invalid data format received from server');
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // Initialize with empty arrays on error
      setProducts([]);
      setTrendingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="container-custom py-16">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchProducts} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Flash Sale Banner */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 sm:py-24">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                {flashSale.name}
              </h1>
              <p className="mb-6 text-lg text-gray-300">
                {flashSale.description}
              </p>
              
              {/* Countdown Timer */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm text-gray-300">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm text-gray-300">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm text-gray-300">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm text-gray-300">Seconds</div>
                  </div>
                </div>
              </div>
              
              <Link to="/products?flash_sale=true">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <img
                src={flashSale.image}
                alt={flashSale.name}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">Trending Products</h2>
              <Link to="/products?sort=trending" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container-custom">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">Featured Products</h2>
              <Link to="/products?featured=true" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;