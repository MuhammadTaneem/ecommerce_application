import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '../../types';
import { useDispatch } from 'react-redux';
import { setSelectedCategory } from '../../store/slices/categorySlice';

interface CategoryTreeNavProps {
  categories: Category[];
  level?: number;
}

const CategoryTreeNav = ({ categories, level = 0 }: CategoryTreeNavProps) => {
  return (
    <ul className={`space-y-1 ${level > 0 ? 'mt-1 ml-4' : ''}`}>
      {categories.map((category) => (
        <CategoryItem 
          key={category.id} 
          category={category} 
          level={level} 
        />
      ))}
    </ul>
  );
};

interface CategoryItemProps {
  category: Category;
  level: number;
}

const CategoryItem = ({ category, level }: CategoryItemProps) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasSubcategories = category.subcategories.length > 0;
  const dispatch = useDispatch();

  const handleCategoryClick = () => {
    dispatch(setSelectedCategory(category.slug));
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <div className="flex items-center">
        {hasSubcategories && (
          <button
            onClick={toggleOpen}
            className="mr-1 p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={isOpen ? 'Collapse category' : 'Expand category'}
          >
            {isOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
        
        <Link
          to={`/products/${category.slug}`}
          className="flex-1 rounded-md py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-primary-400"
          onClick={handleCategoryClick}
        >
          {category.label.charAt(0).toUpperCase() + category.label.slice(1)}
        </Link>
      </div>
      
      {hasSubcategories && isOpen && (
        <CategoryTreeNav 
          categories={category.subcategories} 
          level={level + 1} 
        />
      )}
    </li>
  );
};

export default CategoryTreeNav;