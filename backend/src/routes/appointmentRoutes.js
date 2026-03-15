 const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/authMiddleware');
  const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = require('../controllers/appointmentController');

  // Protect all appointment routes with authentication
  router.use(verifyToken);

  // GET /api/appointments - Get all appointments (with optional filters)
  router.get('/', getAllAppointments);

  // GET /api/appointments/:id - Get single appointment by ID
  router.get('/:id', getAppointmentById);

  // POST /api/appointments - Create new appointment
  router.post('/', createAppointment);

  // PUT /api/appointments/:id - Update appointment
  router.put('/:id', updateAppointment);

  // DELETE /api/appointments/:id - Delete appointment
  router.delete('/:id', deleteAppointment);

  module.exports = router;