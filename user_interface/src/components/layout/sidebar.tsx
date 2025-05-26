import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import CategoryTreeNav from '../navigation/CategoryTreeNav';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { categories } = useSelector((state: RootState) => state.categories);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform overflow-y-auto bg-white p-6 transition-all duration-300 ease-in-out dark:bg-gray-800 md:relative md:inset-y-auto md:left-auto md:z-0 md:flex md:w-64 md:transform-none md:flex-col md:overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-xl font-bold">Categories</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-6 hidden md:block">
          <h2 className="text-xl font-bold">Categories</h2>
        </div>
        
        <nav className="mt-8">
          <CategoryTreeNav categories={categories} />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;