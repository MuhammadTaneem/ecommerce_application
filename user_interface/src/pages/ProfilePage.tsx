import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Package, CreditCard, Settings, User } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Profile data:', data);
    
    // This would be replaced with actual profile update logic
    // dispatch(updateProfile(data));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>
              
              <div className="sm:col-span-2">
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              
              <div>
                <Input
                  label="Phone"
                  {...register('phone')}
                />
              </div>
              
              <div className="sm:col-span-2">
                <Input
                  label="Address"
                  {...register('address')}
                />
              </div>
              
              <div>
                <Input
                  label="City"
                  {...register('city')}
                />
              </div>
              
              <div>
                <Input
                  label="State/Province"
                  {...register('state')}
                />
              </div>
              
              <div>
                <Input
                  label="ZIP/Postal Code"
                  {...register('zip')}
                />
              </div>
              
              <div>
                <Input
                  label="Country"
                  {...register('country')}
                />
              </div>
              
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        );
      
      case 'orders':
        return (
          <div>
            <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Order #{order * 1000}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          Delivered
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$129.99</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          3 items
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div>
            <div className="grid gap-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Visa ending in 1234
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline">
                <CreditCard size={16} className="mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="order-updates"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="order-updates" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Order updates
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="promotions"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="promotions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Promotions and sales
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="newsletter"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Weekly newsletter
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="data-collection"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="data-collection" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Allow data collection for better shopping experience
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="third-party"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="third-party" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Share data with third-party partners
                  </label>
                </div>
              </div>
            </div>
            
            <Button>Save Preferences</Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Account</h1>
      
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold">John Doe</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <User size={16} className="mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'orders'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Package size={16} className="mr-3" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'payment'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <CreditCard size={16} className="mr-3" />
                  Payment Methods
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings size={16} className="mr-3" />
                  Account Settings
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'profile' && 'Profile Information'}
                {activeTab === 'orders' && 'Order History'}
                {activeTab === 'payment' && 'Payment Methods'}
                {activeTab === 'settings' && 'Account Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;