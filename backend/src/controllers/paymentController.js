const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  /**
   * POST /api/payments
   * Create new payment for an appointment
   * Body: { appointmentId, amount, type, isDeposit, notes }
   */
  const createPayment = async (req, res) => {
    try {
      const { appointmentId, amount, type, isDeposit, notes } = req.body;
      const userId = req.user.id; // From JWT token (verifyToken middleware)

      // Validate required fields
      if (!appointmentId || !amount || !type) {
        return res.status(400).json({
          error: 'Appointment ID, amount, and payment type are required'
        });
      }

      // Verify appointment exists
      const appointmentExists = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      });

      if (!appointmentExists) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Validate payment type (CASH or BANK_TRANSFER)
      if (type !== 'CASH' && type !== 'BANK_TRANSFER') {
        return res.status(400).json({
          error: 'Payment type must be CASH or BANK_TRANSFER'
        });
      }

      // Create payment
      const payment = await prisma.payment.create({
        data: {
          appointmentId,
          amount: parseFloat(amount),
          type,
          status: 'COMPLETED', // Payment is completed when recorded
          isDeposit: isDeposit || false,
          notes: notes || '',
          receivedById: userId // Track who recorded this payment
        },
        include: {
          appointment: {
            select: {
              id: true,
              client: {
                select: {
                  name: true
                }
              }
            }
          },
          receivedBy: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // If this is a deposit payment, update appointment.depositReceived
      if (isDeposit) {
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { depositReceived: true }
        });
      }

      res.status(201).json({
        message: 'Payment recorded successfully',
        payment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  };

  /**
   * GET /api/payments/appointment/:appointmentId
   * Get all payments for a specific appointment
   */
  const getPaymentsByAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;

      const payments = await prisma.payment.findMany({
        where: { appointmentId },
        include: {
          receivedBy: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc' // Oldest first (chronological order)
        }
      });

      // Calculate total paid
      const totalPaid = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount);
      }, 0);

      res.status(200).json({
        message: 'Payments retrieved successfully',
        payments,
        totalPaid
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  };

  /**
   * PUT /api/payments/:id
   * Update payment details
   * Body: { amount, type, notes }
   */
  const updatePayment = async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, type, notes } = req.body;

      // Check if payment exists
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Validate payment type if provided
      if (type && type !== 'CASH' && type !== 'BANK_TRANSFER') {
        return res.status(400).json({
          error: 'Payment type must be CASH or BANK_TRANSFER'
        });
      }

      // Build update data
      const updateData = {};
      if (amount !== undefined) updateData.amount = parseFloat(amount);
      if (type !== undefined) updateData.type = type;
      if (notes !== undefined) updateData.notes = notes;

      // Update payment
      const payment = await prisma.payment.update({
        where: { id },
        data: updateData,
        include: {
          receivedBy: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(200).json({
        message: 'Payment updated successfully',
        payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  };

  /**
   * DELETE /api/payments/:id
   * Delete payment record
   */
  const deletePayment = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if payment exists
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      const appointmentId = existingPayment.appointmentId;
      const wasDeposit = existingPayment.isDeposit;

      // Delete payment
      await prisma.payment.delete({
        where: { id }
      });

      // If deleted payment was a deposit, check if any other deposits exist
      if (wasDeposit) {
        const remainingDeposits = await prisma.payment.findMany({
          where: {
            appointmentId: appointmentId,
            isDeposit: true
          }
        });

        // If no deposit payments left, set depositReceived back to false
        if (remainingDeposits.length === 0) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { depositReceived: false }
          });
          console.log(`✅ No deposit payments left - set depositReceived to false for appointment ${appointmentId}`);
        }
      }

      res.status(200).json({
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  };

  module.exports = {
    createPayment,
    getPaymentsByAppointment,
    updatePayment,
    deletePayment
  };