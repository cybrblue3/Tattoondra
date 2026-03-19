import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider } from './contexts/AuthContext';
  import ProtectedRoute from './components/ProtectedRoute';
  import Login from './pages/Login';
  import Dashboard from './pages/Dashboard';
  import Clients from './pages/Clients';
  import ClientDetail from './pages/ClientDetail';
  import ClientForm from './pages/ClientForm';
  import Appointments from './pages/Appointments';
  import AppointmentDetail from './pages/AppointmentDetail';
  import AppointmentForm from './pages/AppointmentForm';
  import Settings from './pages/Settings';

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
              {/* Protected route - Appointments */}
            <Route
              path="/dashboard/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />

            {/* Protected route - New Appointment Form */}
            <Route
              path="/dashboard/appointments/new"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />

            {/* Protected route - Edit Appointment Form */}
            <Route
              path="/dashboard/appointments/:id/edit"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />

            {/* Protected route - Appointment Detail */}
            <Route
              path="/dashboard/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentDetail />
                </ProtectedRoute>
              }
            />

            {/* Protected route - Settings */}
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
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