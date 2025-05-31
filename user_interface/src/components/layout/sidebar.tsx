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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 // Only on mobile
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
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
      {/* Overlay - only on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 transform overflow-y-auto bg-white p-6 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-900 dark:border-r dark:border-gray-800 md:fixed md:top-16 md:bottom-0 md:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0 w-auto min-w-[240px] max-w-[280px]' : '-translate-x-full md:w-0 md:min-w-0 md:max-w-0'
        }`}
      >
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-xl font-bold dark:text-white">Categories</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-6 hidden md:block">
          <h2 className="text-xl font-bold dark:text-white">Categories</h2>
        </div>
        
        <nav className="mt-8">
          <CategoryTreeNav categories={categories} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;