import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/shop/ProductCard';
import { ArrowRight, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import productService from '../services/productService';
import campaignService from '../services/campaignService';
import { ProductType, CampaignType } from '../types/index';
import { toast } from '../hooks/use-toast';

// Define the API response type for campaigns
interface CampaignApiResponse {
  message: string;
  data: CampaignType;
}

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
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [isCountingToStart, setIsCountingToStart] = useState(false);

  // Fetch campaign data
  const fetchCampaignData = async () => {
    try {
      setCampaignLoading(true);
      setCampaignError(null);
      const response = await campaignService.getDashboardCampaign();
      
      // Handle the response based on its shape
      if (response) {
        // Check if it's in the API response format with a data property
        const campaignData = (response as unknown as CampaignApiResponse).data;
        if (campaignData) {
          // Extract campaign from the data property
          setCampaign(campaignData);
        } else {
          // If it's directly a campaign object
          setCampaign(response as CampaignType);
        }
      } else {
        console.log("No campaign data available");
        setCampaign(null);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setCampaignError('Failed to load campaign data');
      setCampaign(null);
    } finally {
      setCampaignLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  // Calculate time left for campaign
  useEffect(() => {
    if (!campaign) return;

    const timer = setInterval(() => {
      const now = new Date();
      
      // Use the appropriate date fields (API returns start_date/end_date while our type might use startDate/endDate)
      const startDate = campaign.startDate || (campaign as any).start_date;
      const endDate = campaign.endDate || (campaign as any).end_date;
      
      if (!startDate || !endDate) {
        console.error("Campaign is missing start or end dates");
        return;
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Check if campaign has started
      if (now < start) {
        // Counting down to start date
        setIsCountingToStart(true);
        const difference = start.getTime() - now.getTime();
        
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        }
      } else {
        // Counting down to end date
        setIsCountingToStart(false);
        const difference = end.getTime() - now.getTime();
        
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign]);

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
      {/* Campaign Banner */}
      {campaign && (
        <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 sm:py-24">
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                  {campaign.name}
                </h1>
                <p className="mb-6 text-lg text-gray-300">
                  {campaign.description}
                </p>
                
                {/* Countdown Timer */}
                <div className="mb-8">
                  <p className="text-lg text-gray-300 mb-2">
                    {isCountingToStart ? 'Sale starts in:' : 'Sale ends in:'}
                  </p>
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
                  src={typeof campaign.image === 'string' ? 
                    // Add base URL if the image path is relative
                    (campaign.image.startsWith('/') && !campaign.image.startsWith('//') ? 
                      `${window.location.origin}${campaign.image}` : campaign.image) 
                    : URL.createObjectURL(campaign.image as File)
                  }
                  alt={campaign.name}
                  className="rounded-lg shadow-xl object-cover h-96 w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Show loading state for campaign */}
      {campaignLoading && (
        <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 sm:py-24">
          <div className="container-custom relative z-10 text-center text-white">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600 rounded-md w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded-md w-1/2 mx-auto mb-8"></div>
              <div className="flex justify-center space-x-6 mb-8">
                <div className="h-12 w-12 bg-gray-600 rounded-md"></div>
                <div className="h-12 w-12 bg-gray-600 rounded-md"></div>
                <div className="h-12 w-12 bg-gray-600 rounded-md"></div>
                <div className="h-12 w-12 bg-gray-600 rounded-md"></div>
              </div>
              <div className="h-10 bg-gray-700 rounded-md w-32 mx-auto"></div>
            </div>
          </div>
        </section>
      )}
      
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