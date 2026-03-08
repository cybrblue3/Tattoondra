import { createContext, useContext, useState, useEffect } from 'react';
  import axios from 'axios';

  // Create the context
  const AuthContext = createContext();

  // Custom hook to use auth context
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };

  // Provider component
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Backend URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // INITIALIZE - Check if user is already logged in

    useEffect(() => {
      const initializeAuth = async () => {
        // Check localStorage for token
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          try {
            // Verify token with backend
            const response = await axios.get(`${API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });

            // Token is valid - set user and token
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            // Token is invalid - clear it
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
          }
        }

        setLoading(false);
      };

      initializeAuth();
    }, []);

    // LOGIN FUNCTION

    const login = async (email, password) => {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        });

        const { token: newToken, user: userData } = response.data;

        // Save to localStorage
        localStorage.setItem('token', newToken);

        // Update state
        setToken(newToken);
        setUser(userData);

        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: error.response?.data?.error || 'Login failed'
        };
      }
    };

    // LOGOUT FUNCTION

    const logout = () => {
      // Clear localStorage
      localStorage.removeItem('token');

      // Clear state
      setToken(null);
      setUser(null);
    };

    // PROVIDE CONTEXT TO APP
    
    const value = {
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };