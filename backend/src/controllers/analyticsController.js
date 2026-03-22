const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  /**
   * GET /api/analytics/dashboard
   * Returns ALL dashboard metrics in a single optimized call
   * - Monthly revenue (current month payments)
   * - Pending balance (total unpaid amounts)
   * - Total revenue (all-time payments)
   * - Upcoming appointments count (future dates)
   * - Active clients count (total clients)
   */
  const getDashboardAnalytics = async (req, res) => {
    try {
      // Fetch ALL appointments with their payments included (1 database query with JOIN)
      const appointments = await prisma.appointment.findMany({
        include: {
          payments: true // Include all related payments in one query
        }
      });

      // Fetch all clients (for active count)
      const clients = await prisma.user.findMany({
        where: { role: 'CLIENT' }, // Only count users with CLIENT role
        select: { id: true }
    });

      // Get current month/year for filtering
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();

      // Initialize counters
      let totalRevenue = 0;
      let monthlyRevenue = 0;
      let pendingBalance = 0;
      let upcomingAppointments = 0;

      // Loop through appointments ONCE and calculate all metrics
      for (const apt of appointments) {
        // Calculate total paid for this appointment from included payments
        const totalPaid = apt.payments.reduce((sum, payment) => {
          return sum + parseFloat(payment.amount);
        }, 0);

        // Add to total revenue (all-time)
        totalRevenue += totalPaid;

        // Add to monthly revenue if appointment is in current month
        const aptDate = new Date(apt.date);
        if (aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear) {
          monthlyRevenue += totalPaid;
        }

        // Calculate pending balance for this appointment
        if (apt.totalPrice) {
          const balance = parseFloat(apt.totalPrice) - totalPaid;
          if (balance > 0) {
            pendingBalance += balance;
          }
        }

        // Count upcoming appointments (future dates)
        if (new Date(apt.date) > now) {
          upcomingAppointments++;
        }
      }

      // Return all metrics in one response
      res.status(200).json({
        message: 'Dashboard analytics retrieved successfully',
        analytics: {
          totalRevenue,
          monthlyRevenue,
          pendingBalance,
          upcomingAppointments,
          activeClients: clients.length,
          appointmentCount: appointments.length,
          currentMonth: now.toLocaleString('es-MX', { month: 'long', year: 'numeric' })
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
    }
  };

  /**
   * GET /api/analytics/finance
   * Returns detailed financial analytics for Finance Reports page
   * - Total revenue (all-time)
   * - Monthly, weekly, daily revenue
   * - Last month and last week revenue (for comparison)
   * - Payment method breakdown (cash vs bank transfer)
   */
  const getFinanceAnalytics = async (req, res) => {
    try {
      // Fetch all payments with appointment info (1 query)
      const payments = await prisma.payment.findMany({
        include: {
          appointment: {
            select: { date: true }
          }
        }
      });

      // Get date ranges
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)

      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const lastWeekStart = new Date(currentWeekStart);
      lastWeekStart.setDate(currentWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(currentWeekStart);
      lastWeekEnd.setSeconds(lastWeekEnd.getSeconds() - 1);

      // Initialize counters
      let totalRevenue = 0;
      let monthlyRevenue = 0;
      let weeklyRevenue = 0;
      let dailyRevenue = 0;
      let lastMonthRevenue = 0;
      let lastWeekRevenue = 0;
      let cashTotal = 0;
      let bankTransferTotal = 0;

      // Loop through payments and categorize
      for (const payment of payments) {
        const amount = parseFloat(payment.amount);
        const paymentDate = new Date(payment.createdAt);

        // Total revenue (all-time)
        totalRevenue += amount;

        // Payment method breakdown
        if (payment.type === 'CASH') {
          cashTotal += amount;
        } else if (payment.type === 'BANK_TRANSFER') {
          bankTransferTotal += amount;
        }

        // Daily revenue (today)
        if (paymentDate >= todayStart) {
          dailyRevenue += amount;
        }

        // Weekly revenue (this week)
        if (paymentDate >= currentWeekStart) {
          weeklyRevenue += amount;
        }

        // Monthly revenue (this month)
        if (paymentDate >= currentMonthStart) {
          monthlyRevenue += amount;
        }

        // Last month revenue (for comparison)
        if (paymentDate >= lastMonthStart && paymentDate <= lastMonthEnd) {
          lastMonthRevenue += amount;
        }

        // Last week revenue (for comparison)
        if (paymentDate >= lastWeekStart && paymentDate < lastWeekEnd) {
          lastWeekRevenue += amount;
        }
      }

      // Return all analytics
      res.status(200).json({
        message: 'Finance analytics retrieved successfully',
        analytics: {
          totalRevenue,
          monthlyRevenue,
          weeklyRevenue,
          dailyRevenue,
          lastMonthRevenue,
          lastWeekRevenue,
          cashTotal,
          bankTransferTotal,
          paymentCount: payments.length
        }
      });

    } catch (error) {
      console.error('Error fetching finance analytics:', error);
      res.status(500).json({ error: 'Failed to fetch finance analytics' });
    }
  };

  module.exports = {
    getDashboardAnalytics,
    getFinanceAnalytics
  };