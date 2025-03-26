
import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const requireAuth = (callback?: () => void) => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/', { state: { from: location } });
    } else if (callback) {
      callback();
    }
  };

  return { ...auth, requireAuth };
};
