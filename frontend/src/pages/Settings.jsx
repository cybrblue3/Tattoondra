 import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert
  } from '@mui/material';
  import {
    ArrowBack as ArrowBackIcon,
    CalendarMonth as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
  } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function Settings() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [calendarConnected, setCalendarConnected] = useState(false);
    const [message, setMessage] = useState('');

    // Check Google Calendar connection status on load
    useEffect(() => {
      checkConnectionStatus();
    }, []);

    const checkConnectionStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/google/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCalendarConnected(response.data.connected);
        setLoading(false);
      } catch (error) {
        console.error('Error checking calendar status:', error);
        setLoading(false);
      }
    };

    const handleConnectCalendar = () => {
    console.log('Button clicked!');
    console.log('API_URL:', API_URL);
    console.log('Token:', token);
    console.log('Full URL:', `${API_URL}/api/auth/google?token=${token}`);
    setConnecting(true);
    // Redirect to backend OAuth endpoint with JWT token as query param
    window.location.href = `${API_URL}/api/auth/google?token=${token}`;
  };

    const handleDisconnectCalendar = async () => {
      try {
        await axios.post(`${API_URL}/api/auth/google/disconnect`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCalendarConnected(false);
        setMessage('Google Calendar desconectado exitosamente');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error disconnecting calendar:', error);
        setMessage('Error al desconectar Google Calendar');
      }
    };

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            Configuración
          </Typography>
        </Box>

        {/* Success/Error Message */}
        {message && (
          <Alert severity={calendarConnected ? "success" : "info"} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* Google Calendar Integration Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <CalendarIcon sx={{ fontSize: 40, color: '#667eea' }} />
              <Box>
                <Typography variant="h6">
                  Integración con Google Calendar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sincroniza tus citas automáticamente con tu calendario de Google
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Connection Status */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                {calendarConnected ? (
                  <>
                    <CheckCircleIcon color="success" />
                    <Typography color="success.main" fontWeight="bold">
                      Conectado
                    </Typography>
                  </>
                ) : (
                  <>
                    <CancelIcon color="error" />
                    <Typography color="text.secondary">
                      No conectado
                    </Typography>
                  </>
                )}
              </Box>

              {/* Connect/Disconnect Button */}
              {calendarConnected ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDisconnectCalendar}
                >
                  Desconectar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleConnectCalendar}
                  disabled={connecting}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white'
                  }}
                >
                  {connecting ? 'Conectando...' : 'Conectar Google Calendar'}
                </Button>
              )}
            </Box>

            {/* Info Text */}
            {!calendarConnected && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Al conectar, tus citas se sincronizarán automáticamente con tu Google Calendar.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Future Settings Section (Placeholder) */}
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="body2" color="text.secondary">
            Más opciones de configuración próximamente...
          </Typography>
        </Paper>
      </Container>
    );
  }

  export default Settings;