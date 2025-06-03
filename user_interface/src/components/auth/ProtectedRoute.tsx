import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from "../../services/auth.services.ts";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  redirectPath = '/login',
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated()
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the current location they were trying to go to when redirected
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;