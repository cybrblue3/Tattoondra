const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  /**
   * GET /api/materials
   * Get all materials with optional filters
   * Query params: search, category, lowStock (boolean)
   */
  const getAllMaterials = async (req, res) => {
    try {
      const { search, category, lowStock } = req.query;

      const where = {};

      // Filter by category
      if (category) {
        where.category = category;
      }

      // Search by name
      if (search) {
        where.name = {
          contains: search,
          mode: 'insensitive'
        };
      }

      // Fetch all materials
      let materials = await prisma.material.findMany({
        where,
        orderBy: {
          name: 'asc'
        }
      });

      // Filter by low stock if requested (quantity below restockThreshold%)
      if (lowStock === 'true') {
        materials = materials.filter(material => {
          // Calculate if stock is below threshold
          // For simplicity, we'll treat restockThreshold as absolute number for now
          return material.quantity <= material.restockThreshold;
        });
      }

      res.status(200).json({
        message: 'Materials retrieved successfully',
        materials
      });
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  };

  /**
   * GET /api/materials/:id
   * Get single material by ID with usage history
   */
  const getMaterialById = async (req, res) => {
    try {
      const { id } = req.params;

      const material = await prisma.material.findUnique({
        where: { id },
        include: {
          usageHistory: {
            include: {
              appointment: {
                select: {
                  id: true,
                  date: true,
                  description: true,
                  client: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }

      res.status(200).json({
        message: 'Material retrieved successfully',
        material
      });
    } catch (error) {
      console.error('Error fetching material:', error);
      res.status(500).json({ error: 'Failed to fetch material' });
    }
  };

  /**
   * POST /api/materials
   * Create new material
   * Body: { name, category, quantity, unit, restockThreshold, costPerUnit }
   */
  const createMaterial = async (req, res) => {
    try {
      const {
        name,
        category,
        quantity,
        unit,
        restockThreshold,
        costPerUnit
      } = req.body;

      // Validate required fields
      if (!name || quantity === undefined) {
        return res.status(400).json({
          error: 'Name and quantity are required'
        });
      }

      // Create material
      const material = await prisma.material.create({
        data: {
          name,
          category: category || null,
          quantity: parseInt(quantity),
          unit: unit || 'unidad',
          restockThreshold: restockThreshold ? parseInt(restockThreshold) : 25,
          costPerUnit: costPerUnit ? parseFloat(costPerUnit) : null
        }
      });

      res.status(201).json({
        message: 'Material created successfully',
        material
      });
    } catch (error) {
      console.error('Error creating material:', error);
      res.status(500).json({ error: 'Failed to create material' });
    }
  };

  /**
   * PUT /api/materials/:id
   * Update existing material
   * Body: { name, category, quantity, unit, restockThreshold, costPerUnit }
   */
  const updateMaterial = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        quantity,
        unit,
        restockThreshold,
        costPerUnit
      } = req.body;

      // Check if material exists
      const existingMaterial = await prisma.material.findUnique({
        where: { id }
      });

      if (!existingMaterial) {
        return res.status(404).json({ error: 'Material not found' });
      }

      // Build update data
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (quantity !== undefined) updateData.quantity = parseInt(quantity);
      if (unit !== undefined) updateData.unit = unit;
      if (restockThreshold !== undefined) updateData.restockThreshold = parseInt(restockThreshold);
      if (costPerUnit !== undefined) updateData.costPerUnit = costPerUnit ? parseFloat(costPerUnit) : null;

      // Update material
      const material = await prisma.material.update({
        where: { id },
        data: updateData
      });

      res.status(200).json({
        message: 'Material updated successfully',
        material
      });
    } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ error: 'Failed to update material' });
    }
  };

  /**
   * DELETE /api/materials/:id
   * Delete material (only if no usage history)
   */
  const deleteMaterial = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if material exists
      const existingMaterial = await prisma.material.findUnique({
        where: { id },
        include: {
          usageHistory: true
        }
      });

      if (!existingMaterial) {
        return res.status(404).json({ error: 'Material not found' });
      }

      // PROTECTION: Cannot delete if usage history exists
      if (existingMaterial.usageHistory.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete material with usage history. Set quantity to 0 instead.'
        });
      }

      // Delete material
      await prisma.material.delete({
        where: { id }
      });

      res.status(200).json({
        message: 'Material deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      res.status(500).json({ error: 'Failed to delete material' });
    }
  };

  /**
   * POST /api/materials/:id/adjust
   * Manual stock adjustment (add or remove inventory)
   * Body: { quantity, reason } - positive to add, negative to remove
   */
  const adjustStock = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, reason } = req.body;

      if (quantity === undefined || quantity === 0) {
        return res.status(400).json({ error: 'Quantity adjustment is required' });
      }

      // Get current material
      const material = await prisma.material.findUnique({
        where: { id }
      });

      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }

      const adjustment = parseInt(quantity);
      const newQuantity = material.quantity + adjustment;

      // Prevent negative stock
      if (newQuantity < 0) {
        return res.status(400).json({
          error: `Cannot remove ${Math.abs(adjustment)} units. Only ${material.quantity} available.`
        });
      }

      // Update material quantity
      const updatedMaterial = await prisma.material.update({
        where: { id },
        data: {
          quantity: newQuantity
        }
      });

      res.status(200).json({
        message: `Stock adjusted successfully: ${adjustment > 0 ? '+' : ''}${adjustment} ${material.unit}`,
        material: updatedMaterial,
        adjustment: {
          amount: adjustment,
          reason: reason || (adjustment > 0 ? 'Restock' : 'Manual adjustment'),
          previousQuantity: material.quantity,
          newQuantity: newQuantity
        }
      });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      res.status(500).json({ error: 'Failed to adjust stock' });
    }
  };

  module.exports = {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    adjustStock
  };