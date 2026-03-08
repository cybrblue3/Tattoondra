import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress
  } from '@mui/material';
  import { Login as LoginIcon } from '@mui/icons-material';

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // HANDLE FORM SUBMIT

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      // Validate inputs
      if (!email || !password) {
        setError('Por favor ingresa tu email y contraseña');
        setLoading(false);
        return;
      }

      // Try to login
      const result = await login(email, password);

      if (result.success) {
        // Login successful - navigate to dashboard
        navigate('/dashboard');
      } else {
        // Login failed - show error
        setError(result.error || 'Error al iniciar sesión');
        setLoading(false);
      }
    };

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
            }}
          >
            {/* Logo/Title */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
              Tattoondra
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sistema de Gestión
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Sistema exclusivo para administración
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  };

  export default Login;