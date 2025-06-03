import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import authService from "../../services/auth.services.ts";

const registerSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      // Remove confirm_password and terms from the data sent to API
      const { confirm_password, terms, ...registerData } = data;
      
      await authService.register(registerData);
      setSuccess('Registration successful! Please check your email to activate your account.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Join us and start shopping
          </p>
        </div>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="First Name"
              placeholder="John"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
          </div>
          
          <div>
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div>
            <Input
              label="Phone"
              type="tel"
              placeholder="+1234567890"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          
          <div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                {...register('terms')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="text-gray-700 dark:text-gray-300"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Privacy Policy
                </a>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.terms.message}
                </p>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;