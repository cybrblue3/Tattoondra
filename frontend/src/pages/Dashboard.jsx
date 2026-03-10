import { useAuth } from '../contexts/AuthContext';
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
    Grid
  } from '@mui/material';
  import {
    Logout as LogoutIcon,
    CalendarMonth,
    People,
    Payments,
    Inventory
  } from '@mui/icons-material';

  const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

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
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CalendarMonth sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Citas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestionar citas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Clients Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/dashboard/clients')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Clientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base de datos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Payments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Payments sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
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
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Inventory sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
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