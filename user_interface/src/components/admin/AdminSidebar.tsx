import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  Tag,
  PackageOpen,
  BarChart3,
  MessageSquare,
  FileText,
  ListFilter,
  Hash,
  Building2,
  Ticket,
  Megaphone
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AdminSidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <PackageOpen size={20} />,
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: <Users size={20} />,
    },
    {
      name: 'Campaigns',
      path: '/admin/campaigns',
      icon: <Megaphone size={20} />,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <Tag size={20} />,
    },
    {
      name: 'Variants',
      path: '/admin/variants',
      icon: <ListFilter size={20} />,
    },
    {
      name: 'Tags',
      path: '/admin/tags',
      icon: <Hash size={20} />,
    },
    {
      name: 'Brands',
      path: '/admin/brands',
      icon: <Building2 size={20} />,
    },
    {
      name: 'Vouchers',
      path: '/admin/vouchers',
      icon: <Ticket size={20} />,
    },
    {
      name: 'Payments',
      path: '/admin/payments',
      icon: <CreditCard size={20} />,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 size={20} />,
    },
    {
      name: 'Reviews',
      path: '/admin/reviews',
      icon: <MessageSquare size={20} />,
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: <FileText size={20} />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-10 ${
        isOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
      }`}
    >
      <div className="h-full overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {item.icon}
                </div>
                <span className={`ml-3 ${!isOpen ? 'md:hidden' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar; 