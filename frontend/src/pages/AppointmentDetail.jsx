import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    Grid,
    CircularProgress,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert
  } from '@mui/material';
  import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
  } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'warning';
      default: return 'default';
    }
  };

  // Status label translation (English → Spanish)
  const getStatusLabel = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'CONFIRMADA';
      case 'COMPLETED': return 'COMPLETADA';
      case 'CANCELLED': return 'CANCELADA';
      case 'NO_SHOW': return 'NO ASISTIÓ';
      case 'PENDING_CONFIRMATION': return 'PENDIENTE DE CONFIRMACIÓN';
      default: return status;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  function AppointmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [appointment, setAppointment] = useState(null);
    const [payments, setPayments] = useState([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Payment form state
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentFormData, setPaymentFormData] = useState({
      amount: '',
      type: 'CASH',
      isDeposit: false,
      notes: ''
    });
    const [paymentErrors, setPaymentErrors] = useState({});
    const [materials, setMaterials] = useState([]);
    const [materialsUsed, setMaterialsUsed] = useState([]);
    const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState('');

    // Fetch appointment
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedAppointment = response.data.appointment;
        setAppointment(fetchedAppointment);

        // Set materials used from appointment
        setMaterialsUsed(fetchedAppointment.materialsUsed || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setLoading(false);
      }
    };

    // Fetch payments
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payments/appointment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(response.data.payments);
        setTotalPaid(response.data.totalPaid);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    // Fetch available materials
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMaterials(response.data.materials);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

   // Add material to appointment
  const handleAddMaterial = async () => {
    console.log('🔵 handleAddMaterial called!');
    console.log('Selected Material:', selectedMaterial);
    console.log('Quantity:', materialQuantity);

    if (!selectedMaterial || !materialQuantity) {
      console.log('❌ Validation failed - missing data');
      return;
    }

    try {
      console.log('🟡 Sending request to:', `${API_URL}/api/appointments/${id}/materials`);
      console.log('🟡 Request body:', {
        materials: [{ materialId: selectedMaterial, quantity: parseInt(materialQuantity) }]
      });

      const response = await axios.post(
        `${API_URL}/api/appointments/${id}/materials`,
        {
          materials: [{ materialId: selectedMaterial, quantity: parseInt(materialQuantity) }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Response:', response.data);

      // Refresh appointment data
      fetchAppointment();
      setMaterialDialogOpen(false);
      setSelectedMaterial('');
      setMaterialQuantity('');
    } catch (error) {
      console.error('❌ Error adding material:', error);
      console.error('❌ Error response:', error.response?.data);
      alert(error.response?.data?.error || 'Error al agregar material');
    }
  };

  // Remove material from appointment
  const handleRemoveMaterial = async (usageId) => {
    try {
      await axios.delete(
        `${API_URL}/api/appointments/${id}/materials/${usageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointment();
    } catch (error) {
      console.error('Error removing material:', error);
      alert(error.response?.data?.error || 'Error al eliminar material');
    }
  };

  // Calculate total material cost
  const calculateMaterialCost = () => {
    return materialsUsed.reduce((total, usage) => {
      return total + (parseFloat(usage.costAtTime || 0) * usage.quantity);
    }, 0);
  };

    useEffect(() => {
      fetchAppointment();
      fetchPayments();
      fetchMaterials();
    }, [id, token]);

    const handleDelete = async () => {
      try {
        await axios.delete(`${API_URL}/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/dashboard/appointments');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert(error.response?.data?.error || 'Error al eliminar la cita');
        setDeleteDialogOpen(false);
      }
    };

    // Payment form handlers
    const handlePaymentChange = (e) => {
      const { name, value, type, checked } = e.target;
      setPaymentFormData({
        ...paymentFormData,
        [name]: type === 'checkbox' ? checked : value
      });
      if (paymentErrors[name]) {
        setPaymentErrors({ ...paymentErrors, [name]: '' });
      }
    };

    const validatePaymentForm = () => {
      const errors = {};
      if (!paymentFormData.amount || parseFloat(paymentFormData.amount) <= 0) {
        errors.amount = 'El monto debe ser mayor a 0';
      }
      setPaymentErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handlePaymentSubmit = async () => {
      if (!validatePaymentForm()) return;

      try {
        await axios.post(
          `${API_URL}/api/payments`,
          {
            appointmentId: id,
            ...paymentFormData
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Refresh data
        fetchPayments();
        fetchAppointment(); // Refresh to update depositReceived status

        // Reset form and close dialog
        setPaymentFormData({
          amount: '',
          type: 'CASH',
          isDeposit: false,
          notes: ''
        });
        setPaymentDialogOpen(false);
      } catch (error) {
        console.error('Error creating payment:', error);
        alert(error.response?.data?.error || 'Error al registrar el pago');
      }
    };

    const handleDeletePayment = async (paymentId) => {
      if (!window.confirm('¿Estás seguro de eliminar este pago?')) return;

      try {
        await axios.delete(`${API_URL}/api/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPayments();
        fetchAppointment();
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Error al eliminar el pago');
      }
    };

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      );
    }

    if (!appointment) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography>Cita no encontrada</Typography>
          <Button onClick={() => navigate('/dashboard/appointments')}>
            Volver a citas
          </Button>
        </Container>
      );
    }

    // Calculate balance due
    const balanceDue = appointment.totalPrice
      ? (parseFloat(appointment.totalPrice) - totalPaid)
      : 0;

    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard/appointments')}
          sx={{ mb: 2, minWidth: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'none' }}>
            Citas
          </Typography>
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" component="h1" gutterBottom>
              Cita - {appointment.client.name}
            </Typography>
            <Chip
              label={getStatusLabel(appointment.status)}
              color={getStatusColor(appointment.status)}
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/dashboard/appointments/${id}/edit`)}
                fullWidth={{ xs: true, sm: false }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth={{ xs: true, sm: false }}
              >
                Eliminar
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Appointment Info */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Fecha y Hora
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(appointment.date)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Duración
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.duration} minutos
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2">
                Descripción
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.description || 'Sin descripción'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2">
                Notas
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.notes || 'Sin notas'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Artista Asignado
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.artist ? appointment.artist.name : 'Sin asignar'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Consentimiento Firmado
              </Typography>
              <Chip
                label={appointment.consentSigned ? 'Sí' : 'No'}
                color={appointment.consentSigned ? 'success' : 'default'}
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Client Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información del Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Nombre
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.client.name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.client.email}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary" variant="body2">
                Teléfono
              </Typography>
              <Typography variant="body1" gutterBottom>
                {appointment.client.phone || 'Sin teléfono'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="text"
                onClick={() => navigate(`/dashboard/clients/${appointment.client.id}`)}
              >
                Ver perfil del cliente
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Información de Pago
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setPaymentDialogOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                color: 'white'
              }}
              fullWidth={{ xs: true, sm: false }}
            >
              Registrar Pago
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Precio Total
                  </Typography>
                  <Typography variant="h6">
                    {appointment.totalPrice ? formatCurrency(appointment.totalPrice) : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Total Pagado
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(totalPaid)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    Balance Pendiente
                  </Typography>
                  <Typography variant="h6" color={balanceDue > 0 ? 'error' : 'success'}>
                    {appointment.totalPrice ? formatCurrency(balanceDue) : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payment History */}
          <Typography variant="subtitle1" gutterBottom>
            Historial de Pagos
          </Typography>
          {payments.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No hay pagos registrados
            </Typography>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Monto</strong></TableCell>
                    <TableCell><strong>Método</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Recibido por</strong></TableCell>
                    <TableCell><strong>Notas</strong></TableCell>
                    <TableCell align="center"><strong>Acción</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.type === 'CASH' ? 'Efectivo' : 'Transferencia'}
                          size="small"
                          color={payment.type === 'CASH' ? 'success' : 'info'}
                        />
                      </TableCell>
                      <TableCell>
                        {payment.isDeposit ? (
                          <Chip label="Depósito" size="small" color="warning" />
                        ) : (
                          <Chip label="Pago" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>{payment.receivedBy.name}</TableCell>
                      <TableCell>{payment.notes || '-'}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Materials Used Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>Materiales Utilizados</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setMaterialDialogOpen(true)}
                fullWidth={{ xs: true, sm: false }}
              >
                Agregar Material
              </Button>
            </Box>

            {materialsUsed.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No se han registrado materiales para esta cita
              </Typography>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Material</strong></TableCell>
                        <TableCell><strong>Categoría</strong></TableCell>
                        <TableCell align="center"><strong>Cantidad Utilizada</strong></TableCell>
                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materialsUsed.map((usage) => (
                        <TableRow key={usage.id}>
                          <TableCell>{usage.material.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={usage.material.category || 'Sin categoría'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {usage.quantity} {usage.material.unit}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveMaterial(usage.id)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>

          {/* Add Material Dialog */}
          <Dialog open={materialDialogOpen} onClose={() => setMaterialDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Material Utilizado</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Material"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  sx={{ mb: 2 }}
                  helperText={
                    selectedMaterial && materials.find(m => m.id === selectedMaterial)
                      ? `Stock disponible: ${materials.find(m => m.id === selectedMaterial).quantity} ${materials.find(m => m.id === selectedMaterial).unit}`
                      : 'Selecciona un material para ver el stock disponible'
                  }
                >
                  {materials.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad Utilizada"
                  value={materialQuantity}
                  onChange={(e) => setMaterialQuantity(e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMaterialDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleAddMaterial}
                variant="contained"
                disabled={!selectedMaterial || !materialQuantity}
              >
                Agregar
              </Button>
            </DialogActions>
          </Dialog>

        {/* Delete Appointment Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar esta cita?
              <br /><br />
              <strong>Cliente:</strong> {appointment.client.name}<br />
              <strong>Fecha:</strong> {formatDate(appointment.date)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Form Dialog */}
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Monto"
                    name="amount"
                    value={paymentFormData.amount}
                    onChange={handlePaymentChange}
                    error={!!paymentErrors.amount}
                    helperText={paymentErrors.amount}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Método de Pago"
                    name="type"
                    value={paymentFormData.type}
                    onChange={handlePaymentChange}
                  >
                    <MenuItem value="CASH">Efectivo</MenuItem>
                    <MenuItem value="BANK_TRANSFER">Transferencia Bancaria</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      id="isDeposit"
                      name="isDeposit"
                      checked={paymentFormData.isDeposit}
                      onChange={handlePaymentChange}
                      style={{ marginRight: 8 }}
                    />
                    <label htmlFor="isDeposit">
                      <Typography variant="body2">
                        Este es el depósito inicial
                      </Typography>
                    </label>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notas (opcional)"
                    name="notes"
                    value={paymentFormData.notes}
                    onChange={handlePaymentChange}
                    placeholder="Información adicional sobre el pago..."
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePaymentSubmit} variant="contained" color="primary">
              Guardar Pago
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  export default AppointmentDetail;