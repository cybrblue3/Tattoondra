import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import axios from 'axios';
  import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
  import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    MenuItem,
    Grid,
    InputAdornment
  } from '@mui/material';
  import {
    ArrowBack,
    Save as SaveIcon
  } from '@mui/icons-material';

  // Country codes with emoji flags
  const COUNTRY_CODES = [
    { code: '+52', country: 'México', flag: '🇲🇽' },
    { code: '+1', country: 'USA/Canadá', flag: '🇺🇸' },
    { code: '+34', country: 'España', flag: '🇪🇸' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+51', country: 'Perú', flag: '🇵🇪' },
    { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
    { code: '+49', country: 'Alemania', flag: '🇩🇪' },
    { code: '+33', country: 'Francia', flag: '🇫🇷' }
  ];

  const ClientForm = () => {
    // Apply flag emoji polyfill for Windows/Chrome
    useEffect(() => {
      polyfillCountryFlagEmojis();
    }, []);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      countryCode: '+52' // Default to Mexico
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
            // Extract country code from phone if it exists
            let countryCode = '+52';
            let phoneNumber = client.phone || '';
            if (phoneNumber) {
              const matchedCode = COUNTRY_CODES.find(c => phoneNumber.startsWith(c.code));
              if (matchedCode) {
                countryCode = matchedCode.code;
                phoneNumber = phoneNumber.substring(matchedCode.code.length).trim();
              }
            }
            setFormData({
              name: client.name,
              email: client.email,
              phone: phoneNumber,
              countryCode: countryCode
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
    // FORMAT PHONE NUMBER (Auto-format as user types)
    // ============================================
    const formatPhoneNumber = (value) => {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limited = digits.slice(0, 10);
      // Format as: 123 456 7890
      if (limited.length <= 3) return limited;
      if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    };

    // ============================================
    // HANDLE INPUT CHANGE
    // ============================================
    const handleChange = (e) => {
      const { name, value } = e.target;

      // Special handling for phone number - auto-format
      if (name === 'phone') {
        const formatted = formatPhoneNumber(value);
        setFormData(prev => ({
          ...prev,
          [name]: formatted
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }

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

      // Name validation: only letters, spaces, hyphens, and accents
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/.test(formData.name)) {
        newErrors.name = 'El nombre solo puede contener letras, espacios y guiones';
      }

      // Phone validation: REQUIRED - exactly 10 digits
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido';
      } else {
        const phoneDigits = formData.phone.replace(/\s/g, '');
        if (!/^\d+$/.test(phoneDigits)) {
          newErrors.phone = 'El teléfono solo puede contener números';
        } else if (phoneDigits.length !== 10) {
          newErrors.phone = 'El teléfono debe tener exactamente 10 dígitos';
        }
      }

      // Email validation: OPTIONAL - but validate format if provided
      if (formData.email.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido (ejemplo: nombre@dominio.com)';
        }
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

        // Prepare data - combine country code with phone
        const submitData = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() ? `${formData.countryCode} ${formData.phone.trim()}` : ''
        };

        if (isEditMode) {
          // UPDATE existing client
          await axios.put(
            `${API_URL}/api/clients/${id}`,
            submitData,
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
            submitData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }

        // Success - navigate back to detail view if editing, or list if creating new
        if (isEditMode) {
          navigate(`/dashboard/clients/${id}`);
        } else {
          navigate('/dashboard/clients');
        }
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
          onClick={() => navigate(isEditMode ? `/dashboard/clients/${id}` : '/dashboard/clients')}
          sx={{ mb: 2, minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
        >
          <ArrowBack sx={{ fontSize: 28 }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
            Clientes
          </Typography>
        </Button>

        {/* Form Card */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
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
              label="Email (opcional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email || 'El email es opcional. Se usará el teléfono como contacto principal'}
              sx={{ mb: 3 }}
            />

            {/* Phone Number with Country Code */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  fullWidth
                  label="Código de País"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
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
                          <span style={{ fontSize: '0.85rem', color: 'gray' }}>
                            {selected?.country}
                          </span>
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
                  required
                  label="Número de Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone || 'Formato: 123 456 7890 (10 dígitos)'}
                  placeholder="123 456 7890"
                  inputProps={{ maxLength: 12 }} // 10 digits + 2 spaces
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(isEditMode ? `/dashboard/clients/${id}` : '/dashboard/clients')}
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