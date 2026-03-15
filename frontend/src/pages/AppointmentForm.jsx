import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Typography,
    Button,
    Paper,
    TextField,
    Box,
    CircularProgress,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Grid
  } from '@mui/material';
  import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function AppointmentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEditMode = !!id;

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      clientId: '',
      date: '',
      duration: 60,
      description: '',
      status: 'CONFIRMED',
      depositAmount: 200,
      depositReceived: false,
      totalPrice: '',
      notes: '',
      consentSigned: false
    });
    const [errors, setErrors] = useState({});

    // Fetch clients for dropdown
    useEffect(() => {
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

      fetchClients();
    }, [token]);

    // Fetch appointment data if in edit mode
    useEffect(() => {
      if (isEditMode) {
        const fetchAppointment = async () => {
          setLoading(true);
          try {
            const response = await axios.get(`${API_URL}/api/appointments/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const appointment = response.data.appointment;

            // Convert database date to datetime-local format
            const dateForInput = new Date(appointment.date).toISOString().slice(0, 16);

            setFormData({
              clientId: appointment.clientId,
              date: dateForInput,
              duration: appointment.duration,
              description: appointment.description || '',
              status: appointment.status,
              depositAmount: parseFloat(appointment.depositAmount),
              depositReceived: appointment.depositReceived,
              totalPrice: appointment.totalPrice ? parseFloat(appointment.totalPrice) : '',
              notes: appointment.notes || '',
              consentSigned: appointment.consentSigned
            });
            setLoading(false);
          } catch (error) {
            console.error('Error fetching appointment:', error);
            setLoading(false);
          }
        };

        fetchAppointment();
      }
    }, [id, isEditMode, token]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      // Clear error when user types
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    };

    const validate = () => {
      const newErrors = {};

      if (!formData.clientId) {
        newErrors.clientId = 'Debes seleccionar un cliente';
      }

      if (!formData.date) {
        newErrors.date = 'La fecha es requerida';
      }

      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = 'La duración debe ser mayor a 0';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      try {
        // Convert datetime-local to ISO string for database
        const submitData = {
          ...formData,
          date: new Date(formData.date).toISOString(),
          totalPrice: formData.totalPrice || null
        };

        if (isEditMode) {
          await axios.put(`${API_URL}/api/appointments/${id}`, submitData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${API_URL}/api/appointments`, submitData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        navigate('/dashboard/appointments');
      } catch (error) {
        console.error('Error saving appointment:', error);
        alert(error.response?.data?.error || 'Error al guardar la cita');
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
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/appointments')}
          sx={{ mb: 2 }}
        >
          Volver a Citas
        </Button>

        {/* Header */}
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Editar Cita' : 'Nueva Cita'}
        </Typography>

        {/* Form */}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Client Selector */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Cliente"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  error={!!errors.clientId}
                  helperText={errors.clientId}
                  disabled={isEditMode} // Can't change client in edit mode
                >
                  <MenuItem value="">Selecciona un cliente</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date and Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  label="Fecha y Hora"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Duration */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Duración (minutos)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  error={!!errors.duration}
                  helperText={errors.duration}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción del tatuaje"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ej: Dragon realista en el hombro"
                />
              </Grid>

              {/* Status (only in edit mode) */}
              {isEditMode && (
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="CONFIRMED">Confirmada</MenuItem>
                    <MenuItem value="COMPLETED">Completada</MenuItem>
                    <MenuItem value="CANCELLED">Cancelada</MenuItem>
                    <MenuItem value="NO_SHOW">No asistió</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Deposit Amount */}
              <Grid item xs={12} md={isEditMode ? 6 : 4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto del Depósito"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleChange}
                />
              </Grid>

              {/* Total Price */}
              <Grid item xs={12} md={isEditMode ? 6 : 4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio Total"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </Grid>

              {/* Deposit Received Checkbox */}
              {isEditMode && (
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.depositReceived}
                        onChange={(e) => setFormData({...formData, depositReceived: e.target.checked})}
                        name="depositReceived"
                      />
                    }
                    label="Depósito recibido"
                  />
                </Grid>
              )}

              {/* Consent Signed Checkbox */}
              {isEditMode && (
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.consentSigned}
                        onChange={(e) => setFormData({...formData, consentSigned: e.target.checked})}
                        name="consentSigned"
                      />
                    }
                    label="Consentimiento firmado"
                  />
                </Grid>
              )}

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notas adicionales"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Cualquier información adicional..."
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard/appointments')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white'
                    }}
                  >
                    {isEditMode ? 'Guardar Cambios' : 'Crear Cita'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }

  export default AppointmentForm;