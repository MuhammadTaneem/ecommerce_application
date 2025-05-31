import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { text: 'Dashboard', path: '/admin' },
        { text: 'Campaigns', path: '/admin/campaigns' },
        { text: 'Products', path: '/admin/products' },
        { text: 'Orders', path: '/admin/orders' },
        { text: 'Customers', path: '/admin/customers' },
        { text: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 border-r border-gray-200 dark:border-gray-700`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.text}>
                                <Link
                                    to={item.path}
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
                    </h2>
                    <div>{/* Add any header actions here */}</div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 