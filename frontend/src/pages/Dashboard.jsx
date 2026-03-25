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
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);
    const [upcomingAppointments, setUpcomingAppointments] = useState(0);
    const [activeClients, setActiveClients] = useState(0);
    const [materialsCount, setMaterialsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    // Calculate ALL dashboard metrics - SINGLE API CALL!
  const calculateFinancials = async () => {
    try {
      // Single API call gets EVERYTHING at once
      const response = await axios.get(`${API_URL}/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const {
        monthlyRevenue,
        pendingBalance,
        upcomingAppointments,
        activeClients
      } = response.data.analytics;

      setMonthlyRevenue(monthlyRevenue);
      setPendingBalance(pendingBalance);
      setUpcomingAppointments(upcomingAppointments);
      setActiveClients(activeClients);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

    // Fetch materials count
    const fetchMaterialsCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMaterialsCount(response.data.materials.length);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        await Promise.all([
          calculateFinancials(),
          fetchMaterialsCount()
        ]);
        setLoading(false);
      };

      fetchData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(amount);
    };

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tattoondra - Admin
            </Typography>
            {/* Hide user name on small screens */}
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user?.name || user?.email}
            </Typography>

            {/* Settings Button - Icon only on mobile */}
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard/settings')}
              startIcon={<SettingsIcon />}
              sx={{ mr: 1, minWidth: { xs: 'auto', sm: 'auto' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Configuración
              </Box>
            </Button>

            {/* Logout Button - Icon only on mobile */}
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Cerrar Sesión
              </Box>
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
              ¡Bienvenida, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema de gestión para Tattoondra
            </Typography>
          </Paper>

          {/* Feature Cards */}
          <Grid container spacing={2} justifyContent="center">
            {/* Appointments Card */}
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 180, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                onClick={() => navigate('/dashboard/appointments')}>
                <CardContent sx={{ textAlign: 'center', px: 1 }}>
                  <CalendarMonth sx={{ fontSize: 45, color: '#764ba2', mb: 1 }} />
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
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 180, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/clients')}>
                <CardContent sx={{ textAlign: 'center', px: 1 }}>
                  <People sx={{ fontSize: 45, color: '#764ba2', mb: 1 }} />
                   <Typography variant="h3" fontWeight="bold" color="primary">
                      {activeClients}
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

            {/* Payments Card - Clean Monthly + Pending */}
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 180, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/finance')}>
                <CardContent sx={{ textAlign: 'center', px: 1 }}>
                  <Payments sx={{ fontSize: 45, color: '#764ba2', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatCurrency(monthlyRevenue)}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Ingresos del Mes
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Pendiente: {formatCurrency(pendingBalance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Inventory Card */}
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <Card sx={{ width: '100%', height: '100%', minHeight: 180, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/inventory')}>
                <CardContent sx={{ textAlign: 'center', px: 1 }}>
                  <Inventory sx={{ fontSize: 40, color: '#764ba2', mb: 1 }} />
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {materialsCount}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Inventario
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Materiales Disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };

  export default Dashboard;