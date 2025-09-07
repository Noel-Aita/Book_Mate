import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return currentUser ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;