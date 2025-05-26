import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <div className="mt-4">
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="mt-8">
        <Link to="/">
          <Button>
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;