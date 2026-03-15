const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/authMiddleware');
  const {
    createPayment,
    getPaymentsByAppointment,
    updatePayment,
    deletePayment
  } = require('../controllers/paymentController');

  // Protect all payment routes with authentication
  router.use(verifyToken);

  // POST /api/payments - Create new payment
  router.post('/', createPayment);

  // GET /api/payments/appointment/:appointmentId - Get all payments for an appointment
  router.get('/appointment/:appointmentId', getPaymentsByAppointment);

  // PUT /api/payments/:id - Update payment
  router.put('/:id', updatePayment);

  // DELETE /api/payments/:id - Delete payment
  router.delete('/:id', deletePayment);

  module.exports = router;