import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider } from './contexts/AuthContext';
  import ProtectedRoute from './components/ProtectedRoute';
  import Login from './pages/Login';
  import Dashboard from './pages/Dashboard';

  function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Default route - redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public route - Login */}
            <Route path="/login" element={<Login />} />

            {/* Protected route - Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  export default App;