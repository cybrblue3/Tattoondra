import { useState, useEffect, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import axios from 'axios';
  import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    CircularProgress,
    InputAdornment
  } from '@mui/material';
  import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People
  } from '@mui/icons-material';

  const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const searchInputRef = useRef(null);
    // FETCH CLIENTS

    const fetchClients = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true); // Only show full-page loading on first load
      }

      const response = await axios.get(`${API_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          search: search || undefined
        }
      });

      setClients(response.data.clients);
      setError('');
    } catch (err) {
      console.error('Fetch clients error:', err);
      setError(err.response?.data?.error || 'Error al cargar clientes');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

    // Fetch on mount and when search changes
    // Fetch on mount
  // Fetch on mount (with loading spinner)
  useEffect(() => {
    fetchClients(true); // true = show loading spinner
  }, []);

  // Debounced search - wait 500ms after user stops typing
  useEffect(() => {
    if (search === '') {
      fetchClients();
      return;
    }

    const timer = setTimeout(() => {
      fetchClients();
    }, 600);

    // Cleanup: cancel timer if user types again
    return () => clearTimeout(timer);
  }, [search]);

  // Maintain focus on search input after results load
  useEffect(() => {
    if (isFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [clients]);

    // DELETE CLIENT
    
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Remove from local state
        setClients(clients.filter(client => client.id !== id));
        setDeleteConfirm(null);
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.error || 'Error al eliminar cliente');
      }
    };

    // KEYBOARD NAVIGATION
    
    const handleKeyDown = (e) => {
      if (!showDropdown || clients.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < clients.length - 1 ? prev + 1 : 0 // Wrap to top
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : clients.length - 1 // Wrap to bottom
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            navigate(`/dashboard/clients/${clients[selectedIndex].id}`);
          }
          break;

        case 'Escape':
          setShowDropdown(false);
          setSelectedIndex(-1);
          break;

        default:
          break;
      }
    };

    // HANDLE RESULT CLICK

    const handleResultClick = (clientId) => {
      navigate(`/dashboard/clients/${clientId}`);
      setShowDropdown(false);
      setSearch('');
    };

    // RENDER

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Clientes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/clients/new')}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Agregar Cliente
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search Bar with Autocomplete */}
  <Box sx={{ position: 'relative', mb: 3 }}>
    <TextField
      fullWidth
      inputRef={searchInputRef}
      placeholder="Buscar por nombre, email o teléfono..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setShowDropdown(true);
        setSelectedIndex(-1);
      }}
      onFocus={() => {
        setIsFocused(true);
        if (search && clients.length > 0) setShowDropdown(true);
      }}
      onBlur={() => {
        // Delay to allow click on dropdown
        setTimeout(() => {
          setIsFocused(false);
          setShowDropdown(false);
        }, 200);
      }}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: search && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => {
                setSearch('');
                setShowDropdown(false);
              }}
            >
              ✕
            </IconButton>
          </InputAdornment>
        )
      }}
    />

    {/* Autocomplete Dropdown */}
    {showDropdown && isFocused && search && clients.length > 0 && (
      <Paper
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          maxHeight: '400px',
          overflow: 'auto',
          mt: 0.5,
          boxShadow: 3
        }}
      >
        {clients.slice(0, 5).map((client, index) => (
          <Box
            key={client.id}
            onClick={() => handleResultClick(client.id)}
            sx={{
              p: 2,
              cursor: 'pointer',
              bgcolor: selectedIndex === index ? 'rgba(102, 126, 234, 0.15)' : 'white',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)'
              },
              borderBottom: index < Math.min(clients.length, 5) - 1 ? '1px solid #eee' : 'none',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People sx={{ color: '#764ba2' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {client.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {client.phone || 'Sin teléfono'}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {clients.length > 5 && (
          <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f9f9f9' }}>
            <Typography variant="caption" color="text.secondary">
              +{clients.length - 5} resultados más en la tabla
            </Typography>
          </Box>
        )}
      </Paper>
    )}
  </Box>

        {/* Clients Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Teléfono</strong></TableCell>
                <TableCell><strong>Fecha de Registro</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(client.createdAt).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                        title="Ver detalles"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm(client.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <Paper
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              p: 3,
              zIndex: 1300,
              minWidth: 300
            }}
          >
            <Typography variant="h6" gutterBottom>
              ¿Eliminar cliente?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Esta acción no se puede deshacer.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Eliminar
              </Button>
            </Box>
          </Paper>
        )}

        {/* Backdrop for delete dialog */}
        {deleteConfirm && (
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
            onClick={() => setDeleteConfirm(null)}
          />
        )}
      </Container>
    );
  };

  export default Clients;