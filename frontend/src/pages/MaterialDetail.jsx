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
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const MaterialDetail = () => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ============================================
  // FETCH MATERIAL DATA
  // ============================================
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/materials/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMaterial(response.data.material);
        setError('');
      } catch (err) {
        console.error('Fetch material error:', err);
        setError(err.response?.data?.error || 'Error al cargar material');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  // ============================================
  // DELETE MATERIAL
  // ============================================
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/materials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/dashboard/inventory');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Error al eliminar material');
      setDeleteConfirm(false);
    }
  };

  // ============================================
  // GET STOCK STATUS
  // ============================================
  const getStockStatus = () => {
    if (!material) return { color: 'default', icon: null, label: 'N/A' };

    if (material.quantity === 0) {
      return {
        color: 'error',
        icon: <ErrorIcon />,
        label: 'Agotado'
      };
    } else if (material.quantity <= material.restockThreshold) {
      return {
        color: 'warning',
        icon: <WarningIcon />,
        label: 'Bajo'
      };
    } else {
      return {
        color: 'success',
        icon: <CheckCircleIcon />,
        label: 'Disponible'
      };
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
  if (error && !material) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/inventory')}
          sx={{ mt: 2 }}
        >
          Volver a Inventario
        </Button>
      </Container>
    );
  }

  const status = getStockStatus();

  // ============================================
  // RENDER
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Button
        onClick={() => navigate('/dashboard/inventory')}
        sx={{ mb: 2, minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
      >
        <ArrowBack sx={{ fontSize: 28 }} />
        <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
          Inventario
        </Typography>
      </Button>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Material Info Card */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
            {material?.name}
          </Typography>
          <Chip
            icon={status.icon}
            label={status.label}
            color={status.color}
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/dashboard/inventory/${id}/edit`)}
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

        {/* Material Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CategoryIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Categoría
                </Typography>
                <Typography variant="body1">
                  {material?.category || 'Sin categoría'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Unidad de Medida
                </Typography>
                <Typography variant="body1">
                  {material?.unit || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircleIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cantidad Actual
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={status.color === 'error' ? 'error' : status.color === 'warning' ? 'warning.main' : 'success.main'}>
                  {material?.quantity} {material?.unit}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Alerta de Reposición
                </Typography>
                <Typography variant="body1">
                  ≤ {material?.restockThreshold} {material?.unit}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
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
              ¿Eliminar material?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Esta acción no se puede deshacer. Se eliminará el material del inventario.
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

export default MaterialDetail;
