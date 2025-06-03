import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import authService from "../../services/auth.services.ts";

const resetPasswordSchema = z.object({
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_new_password: z.string(),
}).refine((data) => data.new_password === data.confirm_new_password, {
  message: 'Passwords do not match',
  path: ['confirm_new_password'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_new_password: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return;
    }

    try {
      setError(null);
      await authService.resetPassword({
        token,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      });
      
      setSuccess('Password has been reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Reset Link</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <div className="mt-6">
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Enter your new password
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
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.new_password?.message}
              {...register('new_password')}
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirm_new_password?.message}
              {...register('confirm_new_password')}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
          >
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Remember your password?{' '}
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

export default ResetPasswordPage; 