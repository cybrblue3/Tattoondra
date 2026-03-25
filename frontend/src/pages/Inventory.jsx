import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CircularProgress,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
  } from '@mui/material';
  import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon
  } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function Inventory() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [materialToAdjust, setMaterialToAdjust] = useState(null);
    const [adjustmentData, setAdjustmentData] = useState({
      quantity: '',
      reason: ''
    });

    useEffect(() => {
      fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMaterials(response.data.materials);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching materials:', error);
        setLoading(false);
      }
    };

    // Get stock status color and icon
    const getStockStatus = (material) => {
      const percentage = (material.quantity / material.restockThreshold) * 100;

      if (material.quantity === 0) {
        return {
          color: 'error',
          icon: <ErrorIcon />,
          label: 'Agotado',
          bgColor: '#ffebee'
        };
      } else if (material.quantity <= material.restockThreshold) {
        return {
          color: 'warning',
          icon: <WarningIcon />,
          label: 'Bajo',
          bgColor: '#fff3e0'
        };
      } else {
        return {
          color: 'success',
          icon: <CheckCircleIcon />,
          label: 'Disponible',
          bgColor: '#e8f5e9'
        };
      }
    };

    const handleDeleteClick = (material) => {
      setMaterialToDelete(material);
      setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      try {
        await axios.delete(`${API_URL}/api/materials/${materialToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeleteDialogOpen(false);
        setMaterialToDelete(null);
        fetchMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
        alert(error.response?.data?.error || 'Error al eliminar material');
      }
    };

    const handleAdjustClick = (material) => {
      setMaterialToAdjust(material);
      setAdjustmentData({ quantity: '', reason: '' });
      setAdjustDialogOpen(true);
    };

    const handleAdjustSubmit = async () => {
      try {
        await axios.post(
          `${API_URL}/api/materials/${materialToAdjust.id}/adjust`,
          adjustmentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdjustDialogOpen(false);
        setMaterialToAdjust(null);
        setAdjustmentData({ quantity: '', reason: '' });
        fetchMaterials();
      } catch (error) {
        console.error('Error adjusting stock:', error);
        alert(error.response?.data?.error || 'Error al ajustar inventario');
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <Button
              onClick={() => navigate('/dashboard')}
              sx={{ minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
            >
              <ArrowBackIcon sx={{ fontSize: 28 }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
                Dashboard
              </Typography>
            </Button>
            <Typography variant="h4" fontWeight="bold" component="h1" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              Inventario
            </Typography>
            <Box sx={{ width: 80 }} /> {/* Spacer to balance */}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/inventory/new')}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                color: 'white'
              }}
              fullWidth={{ xs: true, sm: false }}
            >
              Agregar Material
            </Button>
          </Box>
        </Box>

        {/* Materials Table */}
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Material</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell align="center"><strong>Cantidad</strong></TableCell>
                <TableCell align="center"><strong>Alerta</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay materiales registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((material) => {
                  const status = getStockStatus(material);
                  return (
                    <TableRow
                      key={material.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: status.bgColor
                      }}
                      onClick={() => navigate(`/dashboard/inventory/${material.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {material.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={material.category || 'Sin categoría'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="bold">
                          {material.quantity} {material.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          ≤ {material.restockThreshold} {material.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdjustClick(material);
                            }}
                          >
                            Ajustar
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(material);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar <strong>{materialToDelete?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Stock Adjustment Dialog */}
        <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Ajustar Inventario: {materialToAdjust?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stock actual: <strong>{materialToAdjust?.quantity} {materialToAdjust?.unit}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: e.target.value })}
                helperText="Número positivo para agregar, negativo para remover (ej: 50 o -10)"
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Razón"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Compra de suministros">Compra de suministros</MenuItem>
                <MenuItem value="Ajuste manual">Ajuste manual</MenuItem>
                <MenuItem value="Producto dañado">Producto dañado</MenuItem>
                <MenuItem value="Inventario inicial">Inventario inicial</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdjustDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleAdjustSubmit}
              variant="contained"
              disabled={!adjustmentData.quantity}
            >
              Ajustar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  export default Inventory;