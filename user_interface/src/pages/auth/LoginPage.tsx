import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useState} from 'react';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import authService from "../../services/auth.services.ts";

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Get the redirect path from location state
    const from = location.state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(data);
            
            // If login successful, user data and token are automatically saved by authService
            if (response.data.token) {

                navigate(from, {replace: true});
            }
        } catch (err: any) {
            setError(
                err.response?.data?.detail || 
                err.response?.data?.message || 
                'Login failed. Please check your credentials and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting || loading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Or continue with
              </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Facebook
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;