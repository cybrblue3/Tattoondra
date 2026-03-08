import { Navigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import { Box, CircularProgress } from '@mui/material';

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show loading spinner while checking auth status
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // If authenticated, show the protected content
    return children;
  };

  export default ProtectedRoute;