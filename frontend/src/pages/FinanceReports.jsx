import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Divider,
    CircularProgress
  } from '@mui/material';
  import {
    ArrowBack as ArrowBackIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    AttachMoney as MoneyIcon,
    AccountBalance as BankIcon,
    Paid as CashIcon
  } from '@mui/icons-material';
  import { useAuth } from '../contexts/AuthContext';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function FinanceReports() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
      totalRevenue: 0,
      monthlyRevenue: 0,
      weeklyRevenue: 0,
      dailyRevenue: 0,
      cashTotal: 0,
      bankTransferTotal: 0,
      lastMonthRevenue: 0,
      lastWeekRevenue: 0
    });

    useEffect(() => {
      const fetchFinanceData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/analytics/finance`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAnalytics(response.data.analytics);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching finance data:', error);
          setLoading(false);
        }
      };

      fetchFinanceData();
    }, [token]);

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(amount);
    };

    // Calculate percentage change
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const monthlyChange = calculateChange(analytics.monthlyRevenue, analytics.lastMonthRevenue);
    const weeklyChange = calculateChange(analytics.weeklyRevenue, analytics.lastWeekRevenue);

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
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
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
            Reportes Financieros
          </Typography>
          <Box sx={{ width: 80 }} /> {/* Spacer to balance */}
        </Box>

        {/* Revenue Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Total General
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(analytics.totalRevenue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Desde el inicio
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Este Mes
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrency(analytics.monthlyRevenue)}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {monthlyChange >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography
                    variant="caption"
                    color={monthlyChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {monthlyChange >= 0 ? '+' : ''}{monthlyChange}% vs mes pasado
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon sx={{ color: '#ff9800', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Esta Semana
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {formatCurrency(analytics.weeklyRevenue)}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {weeklyChange >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography
                    variant="caption"
                    color={weeklyChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {weeklyChange >= 0 ? '+' : ''}{weeklyChange}% vs semana pasada
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Daily Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon sx={{ color: '#2196f3', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Hoy
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  {formatCurrency(analytics.dailyRevenue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Payment Method Breakdown */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Desglose por Método de Pago
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Cash */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <CashIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Efectivo
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {formatCurrency(analytics.cashTotal)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 3 }}>
                      {analytics.totalRevenue > 0
                        ? ((analytics.cashTotal / analytics.totalRevenue) * 100).toFixed(0)
                        : 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Bank Transfer */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <BankIcon sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Transferencia
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="info.main">
                          {formatCurrency(analytics.bankTransferTotal)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 3 }}>
                      {analytics.totalRevenue > 0
                        ? ((analytics.bankTransferTotal / analytics.totalRevenue) * 100).toFixed(0)
                        : 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary */}
        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Resumen Rápido
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                📊 Promedio diario (este mes):
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(analytics.monthlyRevenue / new Date().getDate())}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                🎯 Método preferido:
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {analytics.cashTotal > analytics.bankTransferTotal ? 'Efectivo' : 'Transferencia'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  export default FinanceReports;