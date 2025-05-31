import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ProductCard from '../components/shop/ProductCard';
import { ArrowRight, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import sampleProducts from '../data/sampleProducts';

const HomePage = () => {
  const { products } = useSelector((state: RootState) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
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

  // Use sample products if products is empty
  const allProducts = products.length > 0 ? products : sampleProducts;
  
  // Get trending products (using the most viewed/rated ones)
  const trendingProducts = [...allProducts]
    .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
    .slice(0, 8);

  // Get featured products
  const featuredProducts = allProducts.filter(product => product.featured).slice(0, 8);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Products</h2>
            <Link to="/products?featured=true" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;