import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import axios from 'axios';
  import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
  } from '@mui/material';
  import {
    ArrowBack,
    Save as SaveIcon
  } from '@mui/icons-material';

  const ClientForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingClient, setFetchingClient] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const { id } = useParams(); // If id exists, we're editing
    const { token } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const isEditMode = !!id;

    // ============================================
    // FETCH CLIENT DATA (Edit Mode Only)
    // ============================================
    useEffect(() => {
      if (isEditMode) {
        const fetchClient = async () => {
          try {
            setFetchingClient(true);
            const response = await axios.get(`${API_URL}/api/clients/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const client = response.data.client;
            setFormData({
              name: client.name,
              email: client.email,
              phone: client.phone || ''
            });
          } catch (err) {
            console.error('Fetch client error:', err);
            setError(err.response?.data?.error || 'Error al cargar cliente');
          } finally {
            setFetchingClient(false);
          }
        };

        fetchClient();
      }
    }, [id, isEditMode]);

    // ============================================
    // HANDLE INPUT CHANGE
    // ============================================
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error for this field when user types
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    // ============================================
    // VALIDATE FORM
    // ============================================
    const validate = () => {
      const newErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // HANDLE SUBMIT
    // ============================================
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        if (isEditMode) {
          // UPDATE existing client
          await axios.put(
            `${API_URL}/api/clients/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } else {
          // CREATE new client
          await axios.post(
            `${API_URL}/api/clients`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }

        // Success - go back to clients list
        navigate('/dashboard/clients');
      } catch (err) {
        console.error('Submit error:', err);
        setError(err.response?.data?.error || 'Error al guardar cliente');
      } finally {
        setLoading(false);
      }
    };

    // ============================================
    // LOADING STATE (Fetching Client for Edit)
    // ============================================
    if (fetchingClient) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/clients')}
          sx={{ mb: 2 }}
        >
          Volver a Clientes
        </Button>

        {/* Form Card */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              required
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
              autoFocus
            />

            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || 'Opcional'}
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/clients')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Cliente')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  };

  export default ClientForm;