import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from "../../services/auth.services.ts";

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setError('Activation token is missing. Please use the link from your email.');
        setLoading(false);
        return;
      }

      try {
        const response = await authService.activateAccount(token);
        // Redirect to login page after successful activation
        if (response.data.login_url) {
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.detail || 
          err.response?.data?.message || 
          'Failed to activate account. The link may be invalid or expired.'
        );
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Activating Your Account</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please wait while we activate your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Activation Failed</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {error}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Try Logging In
                </Link>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (token) {
                      authService.resendActivationEmail(token);
                    }
                  }}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Resend Activation Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Account Activated!</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Your account has been successfully activated. You will be redirected to the login page shortly.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccountPage; 