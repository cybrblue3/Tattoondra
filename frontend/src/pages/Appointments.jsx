import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress,
    TextField,
    MenuItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
  } from '@mui/material';
  import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, CalendarMonth as CalendarIcon, ViewList as TableIcon } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';
  import CalendarView from '../components/CalendarView';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'warning';
      case 'PENDING_CONFIRMATION': return 'default';
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
      case 'PENDING_CONFIRMATION': return 'PENDIENTE';
      default: return status;
    }
  };

  // Format date for display
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

  function Appointments() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;

        const response = await axios.get(`${API_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        });

        setAppointments(response.data.appointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    // Fetch on mount
    useEffect(() => {
      fetchAppointments();
    }, []);

    // Debounced search
    useEffect(() => {
      if (search === '' && statusFilter === '') {
        fetchAppointments();
        return;
      }

      const timer = setTimeout(() => {
        fetchAppointments();
      }, 500);

      return () => clearTimeout(timer);
    }, [search, statusFilter]);

    // Delete appointment
    const handleDelete = async () => {
      try {
        await axios.delete(`${API_URL}/api/appointments/${appointmentToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchAppointments();
        setDeleteDialogOpen(false);
        setAppointmentToDelete(null);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert(error.response?.data?.error || 'Error al eliminar la cita');
      }
    };

    const openDeleteDialog = (appointment) => {
      setAppointmentToDelete(appointment);
      setDeleteDialogOpen(true);
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Typography variant="h4" component="h1">
                Citas
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              {/* View Toggle Button */}
              <Button
                variant="outlined"
                startIcon={viewMode === 'table' ? <CalendarIcon /> : <TableIcon />}
                onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
                sx={{ borderColor: '#667eea', color: '#667eea' }}
              >
                {viewMode === 'table' ? 'Vista Calendario' : 'Vista Tabla'}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/appointments/new')}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white'
                }}
              >
                Nueva Cita
              </Button>
            </Box>
          </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2}>
            <TextField
              label="Buscar por cliente o descripción"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
              select
              label="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="CONFIRMED">Confirmada</MenuItem>
              <MenuItem value="COMPLETED">Completada</MenuItem>
              <MenuItem value="CANCELLED">Cancelada</MenuItem>
              <MenuItem value="NO_SHOW">No asistió</MenuItem>
            </TextField>
          </Box>
        </Paper>

        {/* Conditional View: Table or Calendar */}
  {viewMode === 'table' ? (
    // TABLE VIEW
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Fecha</strong></TableCell>
            <TableCell><strong>Descripción</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
            <TableCell><strong>Depósito</strong></TableCell>
            <TableCell><strong>Total</strong></TableCell>
            <TableCell align="center"><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No hay citas registradas
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/dashboard/appointments/${appointment.id}`)}
              >
                <TableCell>{appointment.client.name}</TableCell>
                <TableCell>{formatDate(appointment.date)}</TableCell>
                <TableCell>
                  {appointment.description || 'Sin descripción'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(appointment.status)}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.depositReceived ? 'Pagado' : 'Pendiente'}
                    color={appointment.depositReceived ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {appointment.totalPrice ? formatCurrency(appointment.totalPrice) : '-'}
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(appointment);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    // CALENDAR VIEW
    <CalendarView appointments={appointments} />
  )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar esta cita?
              {appointmentToDelete && (
                <>
                  <br /><br />
                  <strong>Cliente:</strong> {appointmentToDelete.client.name}<br />
                  <strong>Fecha:</strong> {formatDate(appointmentToDelete.date)}
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  export default Appointments;