import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-md">
              Featured
            </span>
          )}
        </div>
        
        <CardContent className="flex-1">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-3 flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-4 w-4 ${
                  i < product.rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={!product.inStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;