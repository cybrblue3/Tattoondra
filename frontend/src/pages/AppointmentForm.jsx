import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
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
    Grid,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    Alert
  } from '@mui/material';
  import { ArrowBack as ArrowBackIcon, Save as SaveIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Country codes with emoji flags (same as ClientForm)
  const COUNTRY_CODES = [
    { code: '+52', country: 'México', flag: '🇲🇽' },
    { code: '+1', country: 'USA/Canadá', flag: '🇺🇸' },
    { code: '+34', country: 'España', flag: '🇪🇸' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' }
  ];

  function AppointmentForm() {
    // Apply flag emoji polyfill for Windows/Chrome
    useEffect(() => {
      polyfillCountryFlagEmojis();
    }, []);
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
      totalPrice: '',
      notes: '',
      consentSigned: false
    });
    const [errors, setErrors] = useState({});

    // Quick Add Client Modal State
    const [addClientOpen, setAddClientOpen] = useState(false);
    const [newClientData, setNewClientData] = useState({
      name: '',
      email: '',
      phone: '',
      countryCode: '+52'
    });
    const [clientErrors, setClientErrors] = useState({});
    const [clientSuccess, setClientSuccess] = useState('');

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

            // Convert database date to datetime-local format (preserve local timezone)
            const date = new Date(appointment.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const dateForInput = `${year}-${month}-${day}T${hours}:${minutes}`;

            setFormData({
              clientId: appointment.clientId,
              date: dateForInput,
              duration: appointment.duration,
              description: appointment.description || '',
              status: appointment.status,
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

        // Navigate back to detail view if editing, or list if creating new
        if (isEditMode) {
          navigate(`/dashboard/appointments/${id}`);
        } else {
          navigate('/dashboard/appointments');
        }
      } catch (error) {
        console.error('Error saving appointment:', error);
        alert(error.response?.data?.error || 'Error al guardar la cita');
      }
    };

    // Quick Add Client Functions
    const formatPhoneNumber = (value) => {
      const digits = value.replace(/\D/g, '');
      const limited = digits.slice(0, 10);
      if (limited.length <= 3) return limited;
      if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    };

    const handleClientChange = (field, value) => {
      if (field === 'phone') {
        const formatted = formatPhoneNumber(value);
        setNewClientData({ ...newClientData, [field]: formatted });
      } else {
        setNewClientData({ ...newClientData, [field]: value });
      }
      if (clientErrors[field]) {
        setClientErrors({ ...clientErrors, [field]: '' });
      }
    };

    const validateNewClient = () => {
      const newErrors = {};

      // Name validation
      if (!newClientData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      } else if (newClientData.name.trim().length < 2) {
        newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/.test(newClientData.name)) {
        newErrors.name = 'El nombre solo puede contener letras';
      }

      // Email validation
      if (!newClientData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClientData.email)) {
        newErrors.email = 'Email inválido';
      }

      // Phone validation (optional but must be valid if provided)
      if (newClientData.phone.trim()) {
        const phoneDigits = newClientData.phone.replace(/\s/g, '');
        if (!/^\d+$/.test(phoneDigits)) {
          newErrors.phone = 'Solo números';
        } else if (phoneDigits.length !== 10) {
          newErrors.phone = 'Debe tener 10 dígitos';
        }
      }

      setClientErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddClient = async () => {
      if (!validateNewClient()) {
        return;
      }

      try {
        const clientData = {
          name: newClientData.name.trim(),
          email: newClientData.email.trim().toLowerCase(),
          phone: newClientData.phone.trim() ? `${newClientData.countryCode} ${newClientData.phone.trim()}` : ''
        };

        const response = await axios.post(
          `${API_URL}/api/clients`,
          clientData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newClient = response.data.client;

        // Refresh client list
        setClients([...clients, newClient]);

        // Auto-select the new client
        setFormData({ ...formData, clientId: newClient.id });

        // Show success message
        setClientSuccess('Cliente agregado exitosamente');

        // Reset form
        setNewClientData({ name: '', email: '', phone: '', countryCode: '+52' });

        // Close modal after 1.5 seconds
        setTimeout(() => {
          setAddClientOpen(false);
          setClientSuccess('');
        }, 1500);
      } catch (error) {
        console.error('Error creating client:', error);
        setClientErrors({
          general: error.response?.data?.error || 'Error al crear cliente'
        });
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
          onClick={() => navigate(isEditMode ? `/dashboard/appointments/${id}` : '/dashboard/appointments')}
          sx={{ mb: 2, minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
            Citas
          </Typography>
        </Button>

        {/* Header */}
        <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
          {isEditMode ? 'Editar Cita' : 'Nueva Cita'}
        </Typography>

        {/* Form */}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Client Selector with Search and Quick Add */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Autocomplete
                    fullWidth
                    options={clients}
                    getOptionLabel={(option) => `${option.name} - ${option.email}`}
                    value={clients.find(c => c.id === formData.clientId) || null}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, clientId: newValue ? newValue.id : '' });
                      if (errors.clientId) {
                        setErrors({ ...errors, clientId: '' });
                      }
                    }}
                    disabled={isEditMode} // Can't change client in edit mode
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        required
                        error={!!errors.clientId}
                        helperText={errors.clientId || 'Busca por nombre o email'}
                        placeholder="Escribe para buscar..."
                      />
                    )}
                    noOptionsText="No se encontraron clientes"
                  />
                  {!isEditMode && (
                    <Tooltip title="Agregar nuevo cliente">
                      <IconButton
                        color="primary"
                        onClick={() => setAddClientOpen(true)}
                        sx={{
                          mt: 0.5,
                          border: '2px dashed',
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            borderColor: 'primary.dark'
                          }
                        }}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
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

              {/* Total Price */}
              <Grid item xs={12} md={6}>
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
                    onClick={() => navigate(isEditMode ? `/dashboard/appointments/${id}` : '/dashboard/appointments')}
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

        {/* Quick Add Client Modal */}
        <Dialog
          open={addClientOpen}
          onClose={() => {
            setAddClientOpen(false);
            setNewClientData({ name: '', email: '', phone: '', countryCode: '+52' });
            setClientErrors({});
            setClientSuccess('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <DialogContent>
            {clientSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {clientSuccess}
              </Alert>
            )}
            {clientErrors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {clientErrors.general}
              </Alert>
            )}
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Nombre"
                value={newClientData.name}
                onChange={(e) => handleClientChange('name', e.target.value)}
                error={!!clientErrors.name}
                helperText={clientErrors.name}
                autoFocus
              />
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={newClientData.email}
                onChange={(e) => handleClientChange('email', e.target.value)}
                error={!!clientErrors.email}
                helperText={clientErrors.email}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    select
                    fullWidth
                    label="País"
                    value={newClientData.countryCode}
                    onChange={(e) => setNewClientData({ ...newClientData, countryCode: e.target.value })}
                    SelectProps={{
                      renderValue: (value) => {
                        const selected = COUNTRY_CODES.find(c => c.code === value);
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span style={{
                              fontSize: '1.5rem',
                              fontFamily: '"Twemoji Country Flags", "Segoe UI Emoji", "Apple Color Emoji", sans-serif'
                            }}>
                              {selected?.flag}
                            </span>
                            <span style={{ fontWeight: 500 }}>{selected?.code}</span>
                          </Box>
                        );
                      }
                    }}
                  >
                    {COUNTRY_CODES.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <span style={{
                            fontSize: '1.5rem',
                            fontFamily: '"Twemoji Country Flags", "Segoe UI Emoji", "Apple Color Emoji", sans-serif'
                          }}>
                            {country.flag}
                          </span>
                          <span style={{ fontWeight: 500 }}>{country.code}</span>
                          <span style={{ fontSize: '0.85rem', color: 'gray' }}>
                            {country.country}
                          </span>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    label="Teléfono (Opcional)"
                    value={newClientData.phone}
                    onChange={(e) => handleClientChange('phone', e.target.value)}
                    error={!!clientErrors.phone}
                    helperText={clientErrors.phone || '10 dígitos'}
                    placeholder="123 456 7890"
                    inputProps={{ maxLength: 12 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAddClientOpen(false);
                setNewClientData({ name: '', email: '', phone: '', countryCode: '+52' });
                setClientErrors({});
                setClientSuccess('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddClient}
              variant="contained"
              disabled={!!clientSuccess}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                color: 'white'
              }}
            >
              Agregar Cliente
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  export default AppointmentForm;