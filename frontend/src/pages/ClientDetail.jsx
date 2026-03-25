import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import axios from 'axios';
  import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    Card,
    CardContent
  } from '@mui/material';
  import {
    ArrowBack,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email,
    Phone,
    CalendarMonth,
    Person
  } from '@mui/icons-material';

  const ClientDetail = () => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // ============================================
    // FETCH CLIENT DATA
    // ============================================
    useEffect(() => {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/api/clients/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setClient(response.data.client);
          setError('');
        } catch (err) {
          console.error('Fetch client error:', err);
          setError(err.response?.data?.error || 'Error al cargar cliente');
        } finally {
          setLoading(false);
        }
      };

      fetchClient();
    }, [id]);

    // ============================================
    // DELETE CLIENT
    // ============================================
    const handleDelete = async () => {
      try {
        await axios.delete(`${API_URL}/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        navigate('/dashboard/clients');
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.error || 'Error al eliminar cliente');
        setDeleteConfirm(false);
      }
    };

    // ============================================
    // LOADING STATE
    // ============================================
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      );
    }

    // ============================================
    // ERROR STATE
    // ============================================
    if (error && !client) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard/clients')}
            sx={{ mt: 2 }}
          >
            Volver a Clientes
          </Button>
        </Container>
      );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard/clients')}
          sx={{ mb: 2, minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
        >
          <ArrowBack sx={{ fontSize: 28 }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
            Clientes
          </Typography>
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Client Info Card */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
              {client?.name}
            </Typography>
            <Chip
              label={client?.role || 'CLIENT'}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/dashboard/clients/${id}/edit`)}
                fullWidth={{ xs: true, sm: false }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirm(true)}
                fullWidth={{ xs: true, sm: false }}
              >
                Eliminar
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Contact Information */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Email color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {client?.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {client?.phone || 'No registrado'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CalendarMonth color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cliente desde
                  </Typography>
                  <Typography variant="body1">
                    {new Date(client?.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID de Cliente
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {client?.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Appointment History */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Historial de Citas
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {client?.clientAppointments && client.clientAppointments.length > 0 ? (
            <Grid container spacing={2}>
              {client.clientAppointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1">
                        {new Date(appointment.date).toLocaleDateString('es-MX')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estado: {appointment.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Este cliente aún no tiene citas registradas
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <>
            <Paper
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                p: 3,
                zIndex: 1300,
                minWidth: 400
              }}
            >
              <Typography variant="h6" gutterBottom>
                ¿Eliminar cliente?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Esta acción no se puede deshacer. Se eliminará toda la información del cliente.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => setDeleteConfirm(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </Box>
            </Paper>

            {/* Backdrop */}
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1299
              }}
              onClick={() => setDeleteConfirm(false)}
            />
          </>
        )}
      </Container>
    );
  };

  export default ClientDetail;