import {
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  AlertCircle
} from 'lucide-react';

const DashboardPage = () => {
  // In a real app, these would be fetched from an API
  const stats = [
    {
      title: 'Total Sales',
      value: '$24,780',
      change: '+12%',
      isPositive: true,
      icon: <TrendingUp size={24} />,
      color: 'bg-blue-500',
    },
    {
      title: 'Orders',
      value: '578',
      change: '+5%',
      isPositive: true,
      icon: <Package size={24} />,
      color: 'bg-purple-500',
    },
    {
      title: 'Customers',
      value: '1,429',
      change: '+18%',
      isPositive: true,
      icon: <Users size={24} />,
      color: 'bg-green-500',
    },
    {
      title: 'Refunds',
      value: '$1,280',
      change: '-3%',
      isPositive: false,
      icon: <CreditCard size={24} />,
      color: 'bg-red-500',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-7652',
      customer: 'John Doe',
      date: '2023-08-15',
      status: 'Delivered',
      amount: '$125.00',
      statusColor: 'text-green-500',
    },
    {
      id: 'ORD-7651',
      customer: 'Jane Smith',
      date: '2023-08-15',
      status: 'Processing',
      amount: '$258.50',
      statusColor: 'text-blue-500',
    },
    {
      id: 'ORD-7650',
      customer: 'Robert Johnson',
      date: '2023-08-14',
      status: 'Shipped',
      amount: '$89.99',
      statusColor: 'text-purple-500',
    },
    {
      id: 'ORD-7649',
      customer: 'Emily Davis',
      date: '2023-08-14',
      status: 'Pending',
      amount: '$432.25',
      statusColor: 'text-yellow-500',
    },
    {
      id: 'ORD-7648',
      customer: 'Michael Wilson',
      date: '2023-08-13',
      status: 'Cancelled',
      amount: '$65.00',
      statusColor: 'text-red-500',
    },
  ];

  const lowStockProducts = [
    {
      id: 'PRD-345',
      name: 'Wireless Earbuds',
      stock: 5,
      threshold: 10,
    },
    {
      id: 'PRD-278',
      name: 'Smart Watch',
      stock: 3,
      threshold: 8,
    },
    {
      id: 'PRD-189',
      name: 'Bluetooth Speaker',
      stock: 2,
      threshold: 10,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome back, Admin!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                {stat.icon}
              </div>
              <div className={`flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <span className="text-sm font-medium">{stat.change}</span>
                {stat.isPositive ? (
                  <ArrowUpRight size={16} className="ml-1" />
                ) : (
                  <ArrowDownRight size={16} className="ml-1" />
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {order.customer}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {order.date}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`font-medium ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <a href="/admin/orders" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              View All Orders
            </a>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Low Stock Alert</h2>
            <div className="bg-red-100 text-red-600 p-1 rounded-full">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">{product.stock} left</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Threshold: {product.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <a href="/admin/products" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              Manage Inventory
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 