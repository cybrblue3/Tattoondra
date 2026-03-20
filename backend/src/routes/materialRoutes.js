const express = require('express');
  const router = express.Router();
  const {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    adjustStock
  } = require('../controllers/materialController');
  const { verifyToken } = require('../middleware/authMiddleware');

  // Protect all material routes with authentication
  router.use(verifyToken);

  // GET /api/materials - Get all materials (with optional filters)
  router.get('/', getAllMaterials);

  // GET /api/materials/:id - Get single material with usage history
  router.get('/:id', getMaterialById);

  // POST /api/materials - Create new material
  router.post('/', createMaterial);

  // PUT /api/materials/:id - Update material
  router.put('/:id', updateMaterial);

  // DELETE /api/materials/:id - Delete material
  router.delete('/:id', deleteMaterial);

  // POST /api/materials/:id/adjust - Manual stock adjustment
  router.post('/:id/adjust', adjustStock);

  module.exports = router;