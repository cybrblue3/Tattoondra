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
    Grid,
    MenuItem
  } from '@mui/material';
  import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const CATEGORIES = [
    'Tinta',
    'Agujas',
    'Guantes',
    'Papel Transfer',
    'Limpieza',
    'Equipo',
    'Otro'
  ];

  function MaterialForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      quantity: '',
      unit: 'unidad',
      restockThreshold: '25',
      costPerUnit: ''
    });
    const [errors, setErrors] = useState({});

    // Fetch material data if in edit mode
    useEffect(() => {
      if (isEditMode) {
        const fetchMaterial = async () => {
          setLoading(true);
          try {
            const response = await axios.get(`${API_URL}/api/materials/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const material = response.data.material;

            setFormData({
              name: material.name,
              category: material.category || '',
              quantity: material.quantity.toString(),
              unit: material.unit,
              restockThreshold: material.restockThreshold.toString(),
              costPerUnit: material.costPerUnit ? parseFloat(material.costPerUnit).toString() : ''
            });
            setLoading(false);
          } catch (error) {
            console.error('Error fetching material:', error);
            setLoading(false);
          }
        };

        fetchMaterial();
      }
    }, [id, isEditMode, token]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
      // Clear error when user types
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    };

    const validate = () => {
      const newErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }

      if (!formData.quantity || parseInt(formData.quantity) < 0) {
        newErrors.quantity = 'La cantidad debe ser mayor o igual a 0';
      }

      if (!formData.restockThreshold || parseInt(formData.restockThreshold) < 0) {
        newErrors.restockThreshold = 'El umbral debe ser mayor o igual a 0';
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
        const submitData = {
          name: formData.name.trim(),
          category: formData.category || null,
          quantity: parseInt(formData.quantity),
          unit: formData.unit,
          restockThreshold: parseInt(formData.restockThreshold),
          costPerUnit: formData.costPerUnit ? parseFloat(formData.costPerUnit) : null
        };

        if (isEditMode) {
          await axios.put(`${API_URL}/api/materials/${id}`, submitData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${API_URL}/api/materials`, submitData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        navigate('/dashboard/inventory');
      } catch (error) {
        console.error('Error saving material:', error);
        alert(error.response?.data?.error || 'Error al guardar material');
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
            onClick={() => navigate('/dashboard/inventory')}
          >
            Inventario
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Editar Material' : 'Nuevo Material'}
          </Typography>
        </Box>

        {/* Form */}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Material"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="Ej: Tinta Negra"
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoría"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin categoría</MenuItem>
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Cantidad"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Unit */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Unidad"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <MenuItem value="unidad">Unidad</MenuItem>
                  <MenuItem value="ml">Mililitros (ml)</MenuItem>
                  <MenuItem value="gr">Gramos (gr)</MenuItem>
                  <MenuItem value="paquete">Paquete</MenuItem>
                  <MenuItem value="caja">Caja</MenuItem>
                  <MenuItem value="par">Par</MenuItem>
                </TextField>
              </Grid>

              {/* Restock Threshold */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Alerta de Stock Bajo"
                  name="restockThreshold"
                  value={formData.restockThreshold}
                  onChange={handleChange}
                  error={!!errors.restockThreshold}
                  helperText={errors.restockThreshold || "Alertar cuando la cantidad sea igual o menor a este valor"}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Cost Per Unit */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Costo por Unidad (Opcional)"
                  name="costPerUnit"
                  value={formData.costPerUnit}
                  onChange={handleChange}
                  placeholder="0.00"
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Para cálculo de costos y ganancias"
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/inventory')}
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
                {isEditMode ? 'Guardar Cambios' : 'Crear Material'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    );
  }

  export default MaterialForm;