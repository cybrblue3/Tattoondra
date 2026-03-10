import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider } from './contexts/AuthContext';
  import ProtectedRoute from './components/ProtectedRoute';
  import Login from './pages/Login';
  import Dashboard from './pages/Dashboard';
  import Clients from './pages/Clients';
  import ClientDetail from './pages/ClientDetail';
  import ClientForm from './pages/ClientForm';

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
             {/* Protected route - Clients */}
              <Route
                path="/dashboard/clients"
                element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                }
              />
              {/* Protected route - New Client Form */}
              <Route
                path="/dashboard/clients/new"
                element={
                  <ProtectedRoute>
                    <ClientForm />
                  </ProtectedRoute>
                }
              />

              {/* Protected route - Edit Client Form */}
              <Route
                path="/dashboard/clients/:id/edit"
                element={
                  <ProtectedRoute>
                    <ClientForm />
                  </ProtectedRoute>
                }
              />
              {/* Protected route - Client Detail */}
              <Route
                path="/dashboard/clients/:id"
                element={
                  <ProtectedRoute>
                    <ClientDetail />
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