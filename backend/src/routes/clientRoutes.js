const express = require('express');
  const router = express.Router();
  const {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
  } = require('../controllers/clientController');
  const { verifyToken } = require('../middleware/authMiddleware');

  // ALL ROUTES PROTECTED (Admin only)

  // Apply verifyToken middleware to ALL routes
  router.use(verifyToken);

  // CLIENT ROUTES
  

  // Get all clients (with optional search)
  // GET /api/clients?search=maria
  router.get('/', getAllClients);

  // Get one client by ID
  // GET /api/clients/cm123abc
  router.get('/:id', getClientById);

  // Create new client
  // POST /api/clients
  router.post('/', createClient);

  // Update client
  // PUT /api/clients/cm123abc
  router.put('/:id', updateClient);

  // Delete client
  // DELETE /api/clients/cm123abc
  router.delete('/:id', deleteClient);

  module.exports = router;