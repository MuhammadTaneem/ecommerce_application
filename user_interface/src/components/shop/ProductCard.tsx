import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Card, CardContent, CardTitle } from '../ui/Card';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: string) => {
    return `৳${parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const hasDiscount = product.discount_price && 
    parseFloat(product.discount_price) < parseFloat(product.base_price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.base_price) - parseFloat(product.discount_price)) / parseFloat(product.base_price)) * 100)
    : 0;
  const productImage = product.images?.[0]?.image || product.thumbnail;

  return (
    <Card className="group h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
              -{discountPercentage}%
            </span>
          )}
        </div>
        
        <CardContent className="flex-1 p-4">
          <CardTitle className="line-clamp-1 text-base font-medium">
            {product.name}
          </CardTitle>
          
          <div className="mt-2 flex items-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.discount_price || product.base_price)}
            </p>
            {hasDiscount && (
              <p className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(product.base_price)}
              </p>
            )}
          </div>
          
          {product.short_description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {product.short_description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;