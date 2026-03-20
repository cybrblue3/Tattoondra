import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';  
import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Grid,
    Chip
  } from '@mui/material';
  import {
    Logout as LogoutIcon,
    CalendarMonth,
    People,
    Payments,
    Inventory,
    Settings as SettingsIcon
  } from '@mui/icons-material';

  const Dashboard = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const { token } = useAuth();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

        // Fetch appointments
      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAppointments(response.data.appointments);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      };

      // Fetch clients
      const fetchClients = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setClients(response.data.clients);
        } catch (error) {
          console.error('Error fetching clients:', error);
        }
      };

      // Calculate revenue (we'll do this next)
      const calculateRevenue = async () => {
        // TODO: We'll add this logic in a moment
        setTotalRevenue(0); // Placeholder for now
      };

      useEffect(() => {
    const fetchData = async () => {
      await fetchAppointments();
      await fetchClients();
      await calculateRevenue();
      setLoading(false); // Done loading!
    };

        fetchData();
      }, []); // Empty array = run once when component mounts

       // Calculate upcoming appointments (future dates only)
      const upcomingAppointments = appointments.filter(apt => {
        return new Date(apt.date) > new Date(); // Date is in the future
      }).length;

      // Active clients count
      const activeClientsCount = clients.length;

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tattoondra - Admin
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name || user?.email}
            </Typography>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard/settings')}
              startIcon={<SettingsIcon />}
              sx={{ mr: 1 }}
            >
              Configuración
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              ¡Bienvenida, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema de gestión para Tattoondra
            </Typography>
          </Paper>

          {/* Feature Cards */}
          <Grid container spacing={3}>
            {/* Appointments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 220, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                onClick={() => navigate('/dashboard/appointments')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CalendarMonth sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {upcomingAppointments}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Citas Próximas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestionar citas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Clients Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 220, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/clients')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
                   <Typography variant="h3" fontWeight="bold" color="primary">
                      {activeClientsCount}
                    </Typography>
                  <Typography variant="h6" gutterBottom>
                    Clientes Activos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base de datos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Payments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 220, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Payments sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    $
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Pagos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seguimiento financiero
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Inventory Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 220, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/inventory')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Inventory sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    #
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Inventario
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Materiales
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Coming Soon Section */}
          <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              🚧 Funcionalidades en construcción 🚧
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Próximamente: Gestión de citas, clientes, pagos e inventario
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  };

  export default Dashboard;