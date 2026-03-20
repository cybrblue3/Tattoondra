const { PrismaClient } = require('@prisma/client');
const { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = require('../services/googleCalendarService');
const prisma = new PrismaClient();

  /**
   * GET /api/appointments
   * Get all appointments with optional filters
   * Query params: search, status, startDate, endDate, clientId
   */
  const getAllAppointments = async (req, res) => {
    try {
      const { search, status, startDate, endDate, clientId } = req.query;

      const where = {};

      // Filter by status (CONFIRMED, COMPLETED, CANCELLED, NO_SHOW)
      if (status) {
        where.status = status;
      }

      // Filter by specific client
      if (clientId) {
        where.clientId = clientId;
      }

      // Filter by date range
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = new Date(startDate); // Greater than or equal (start date)
        }
        if (endDate) {
          where.date.lte = new Date(endDate); // Less than or equal (end date)
        }
      }

      // Search across multiple fields (client name, email, description, notes)
      if (search) {
        where.OR = [
          { description: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { client: { name: { contains: search, mode: 'insensitive' } } },
          { client: { email: { contains: search, mode: 'insensitive' } } }
        ];
      }

      // Fetch appointments with related data (client, artist, payments)
      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          payments: true
        },
        orderBy: {
          date: 'desc' // Most recent appointments first
        }
      });

      res.status(200).json({
        message: 'Appointments retrieved successfully',
        appointments
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  };

  /**
   * GET /api/appointments/:id
   * Get single appointment by ID with full details
   */
  const getAppointmentById = async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          payments: {
            orderBy: {
              createdAt: 'asc' // Oldest payments first (chronological order)
            },
            include: {
              receivedBy: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          materialsUsed: {
            include: {
              material: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      // If appointment doesn't exist, return 404
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(200).json({
        message: 'Appointment retrieved successfully',
        appointment
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  };

  /**
   * POST /api/appointments
   * Create new appointment (Alejandra creates appointments manually)
   * Body: { clientId, date, duration, description, depositAmount, totalPrice, notes, artistId }
   */
  const createAppointment = async (req, res) => {
    try {
      const {
        clientId,
        date,
        duration,
        description,
        depositAmount,
        totalPrice,
        notes,
        artistId
      } = req.body;

      // Validate required fields
      if (!clientId || !date) {
        return res.status(400).json({
          error: 'Client ID and date are required'
        });
      }

      // Verify client exists in database
      const clientExists = await prisma.user.findUnique({
        where: { id: clientId }
      });

      if (!clientExists) {
        return res.status(404).json({ error: 'Client not found' });
      }

      // Verify client has CLIENT role (can't create appointment for ADMIN)
      if (clientExists.role !== 'CLIENT') {
        return res.status(400).json({ error: 'Selected user is not a client' });
      }

      // If artistId provided, verify artist exists and has correct role
      if (artistId) {
        const artistExists = await prisma.user.findUnique({
          where: { id: artistId }
        });

        if (!artistExists) {
          return res.status(404).json({ error: 'Artist not found' });
        }

        if (artistExists.role !== 'ARTIST' && artistExists.role !== 'ADMIN') {
          return res.status(400).json({ error: 'Selected user is not an artist' });
        }
      }

      // Create appointment (default status is CONFIRMED since Alejandra creates it)
      const appointment = await prisma.appointment.create({
        data: {
          clientId,
          artistId: artistId || null,
          date: new Date(date),
          duration: parseInt(duration) || 60, // Default 1 hour
          description: description || '',
          depositAmount: parseFloat(depositAmount) || 200.00, // Default $200 deposit
          totalPrice: totalPrice ? parseFloat(totalPrice) : null,
          notes: notes || '',
          status: 'CONFIRMED' // Default to CONFIRMED (not PENDING!)
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Try to create Google Calendar event (if user has connected calendar)
      try {
        // Use the logged-in user's ID (Alejandra - the one creating the appointment)
        const calendarEventId = await createCalendarEvent(req.user.id, {
          date: appointment.date,
          duration: appointment.duration,
          clientName: appointment.client.name,
          description: appointment.description
        });

        // Update appointment with Google Calendar event ID
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { googleCalendarEventId: calendarEventId }
        });

        console.log('Google Calendar event created:', calendarEventId);
      } catch (calendarError) {
        // Calendar sync failed, but appointment was created successfully
        // Don't block the appointment creation - just log the error
        console.error('Failed to sync with Google Calendar:', calendarError.message);
      }

      res.status(201).json({
        message: 'Appointment created successfully',
        appointment
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  };

  /**
   * PUT /api/appointments/:id
   * Update existing appointment
   * Body: { date, duration, description, status, depositAmount, depositReceived, totalPrice, notes, consentSigned, artistId }
   */
  const updateAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        date,
        duration,
        description,
        status,
        depositAmount,
        depositReceived,
        totalPrice,
        notes,
        consentSigned,
        artistId
      } = req.body;

      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id }
      });

      if (!existingAppointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // If artistId provided, verify artist exists
      if (artistId !== undefined) {
        if (artistId) {
          const artistExists = await prisma.user.findUnique({
            where: { id: artistId }
          });

          if (!artistExists) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          if (artistExists.role !== 'ARTIST' && artistExists.role !== 'ADMIN') {
            return res.status(400).json({ error: 'Selected user is not an artist' });
          }
        }
      }

      // Build update data object (only update fields that were provided)
      const updateData = {};
      if (date !== undefined) updateData.date = new Date(date);
      if (duration !== undefined) updateData.duration = parseInt(duration);
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (depositAmount !== undefined) updateData.depositAmount = parseFloat(depositAmount);
      if (depositReceived !== undefined) updateData.depositReceived = depositReceived;
      if (totalPrice !== undefined) updateData.totalPrice = parseFloat(totalPrice);
      if (notes !== undefined) updateData.notes = notes;
      if (consentSigned !== undefined) {
        updateData.consentSigned = consentSigned;
        // Auto-set timestamp when consent is signed
        if (consentSigned && !existingAppointment.consentSignedAt) {
          updateData.consentSignedAt = new Date();
        }
      }
      if (artistId !== undefined) updateData.artistId = artistId || null;

      // Update appointment
      const appointment = await prisma.appointment.update({
        where: { id },
        data: updateData,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          payments: true
        }
      });

      // Try to update Google Calendar event (if it exists)
      if (appointment.googleCalendarEventId) {
        try {
          await updateCalendarEvent(req.user.id, appointment.googleCalendarEventId, {
            date: appointment.date,
            duration: appointment.duration,
            clientName: appointment.client.name,
            description: appointment.description
          });
          console.log('Google Calendar event updated:', appointment.googleCalendarEventId);
        } catch (calendarError) {
          console.error('Failed to update Google Calendar event:', calendarError.message);
        }
      }

      // If status changed TO COMPLETED, deduct materials from inventory
      if (status === 'COMPLETED' && existingAppointment.status !== 'COMPLETED') {
        console.log('🟢 Appointment marked COMPLETED - deducting materials from inventory');

        // Fetch materials used for this appointment
        const materialsUsed = await prisma.materialUsage.findMany({
          where: { appointmentId: id },
          include: { material: true }
        });

        // Deduct each material from inventory
        for (const usage of materialsUsed) {
          const currentMaterial = await prisma.material.findUnique({
            where: { id: usage.materialId }
          });

          if (currentMaterial) {
            const newQuantity = currentMaterial.quantity - usage.quantity;

            // Prevent negative inventory (just in case)
            if (newQuantity < 0) {
              console.warn(`⚠️ Warning: ${currentMaterial.name} would go negative. Setting to 0.`);
              await prisma.material.update({
                where: { id: usage.materialId },
                data: { quantity: 0 }
              });
            } else {
              await prisma.material.update({
                where: { id: usage.materialId },
                data: { quantity: newQuantity }
              });
              console.log(`✅ Deducted ${usage.quantity} ${currentMaterial.unit} of ${currentMaterial.name}`);
            }
          }
        }
      }

      res.status(200).json({
        message: 'Appointment updated successfully',
        appointment
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  };

  /**
   * DELETE /api/appointments/:id
   * Delete appointment (only if no payments exist)
   */
  const deleteAppointment = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if appointment exists
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          payments: true
        }
      });

      if (!existingAppointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // PROTECTION: Cannot delete if payments exist (foreign key protection)
      if (existingAppointment.payments.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete appointment with existing payments. Please delete payments first or cancel the appointment instead.'
        });
      }

      // Try to delete Google Calendar event first (if it exists)
      if (existingAppointment.googleCalendarEventId) {
        try {
          await deleteCalendarEvent(req.user.id, existingAppointment.googleCalendarEventId);
          console.log('Google Calendar event deleted:', existingAppointment.googleCalendarEventId);
        } catch (calendarError) {
          console.error('Failed to delete Google Calendar event:', calendarError.message);
        }
      }

      // Delete appointment
      await prisma.appointment.delete({
        where: { id }
      });

      res.status(200).json({
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  };

  /**
   * POST /api/appointments/:id/materials
   * Add materials used to an appointment
   * Body: { materials: [{ materialId, quantity }] }
   */
  const addMaterialsToAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const { materials } = req.body;

      if (!materials || !Array.isArray(materials) || materials.length === 0) {
        return res.status(400).json({ error: 'Materials array is required' });
      }

      // Check if appointment exists
      const appointment = await prisma.appointment.findUnique({
        where: { id }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Validate all materials exist and have enough stock
      for (const item of materials) {
        const material = await prisma.material.findUnique({
          where: { id: item.materialId }
        });

        if (!material) {
          return res.status(404).json({
            error: `Material with ID ${item.materialId} not found`
          });
        }

        // Check if there's enough stock (only if appointment is COMPLETED)
        if (appointment.status === 'COMPLETED' && material.quantity < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for ${material.name}. Available: ${material.quantity}, Requested:
  ${item.quantity}`
          });
        }
      }

      // Create material usage records
      const createdUsages = [];
      for (const item of materials) {
        const material = await prisma.material.findUnique({
          where: { id: item.materialId }
        });

        const usage = await prisma.materialUsage.create({
          data: {
            appointmentId: id,
            materialId: item.materialId,
            quantity: parseInt(item.quantity),
            costAtTime: material.costPerUnit
          },
          include: {
            material: true
          }
        });

        createdUsages.push(usage);

        // Deduct from inventory if appointment is COMPLETED
        if (appointment.status === 'COMPLETED') {
          await prisma.material.update({
            where: { id: item.materialId },
            data: {
              quantity: material.quantity - parseInt(item.quantity)
            }
          });
        }
      }

      res.status(201).json({
        message: 'Materials added successfully',
        materialsUsed: createdUsages
      });
    } catch (error) {
      console.error('Error adding materials:', error);
      res.status(500).json({ error: 'Failed to add materials' });
    }
  };

  /**
   * DELETE /api/appointments/:appointmentId/materials/:usageId
   * Remove a material usage record
   */
  const removeMaterialFromAppointment = async (req, res) => {
    try {
      const { appointmentId, usageId } = req.params;

      // Find the usage record
      const usage = await prisma.materialUsage.findUnique({
        where: { id: usageId },
        include: {
          appointment: true,
          material: true
        }
      });

      if (!usage) {
        return res.status(404).json({ error: 'Material usage not found' });
      }

      if (usage.appointmentId !== appointmentId) {
        return res.status(400).json({ error: 'Material usage does not belong to this appointment' });
      }

      // If appointment was COMPLETED, restore the inventory
      if (usage.appointment.status === 'COMPLETED') {
        await prisma.material.update({
          where: { id: usage.materialId },
          data: {
            quantity: usage.material.quantity + usage.quantity
          }
        });
      }

      // Delete the usage record
      await prisma.materialUsage.delete({
        where: { id: usageId }
      });

      res.status(200).json({
        message: 'Material removed successfully'
      });
    } catch (error) {
      console.error('Error removing material:', error);
      res.status(500).json({ error: 'Failed to remove material' });
    }
  };

  module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    addMaterialsToAppointment,
    removeMaterialFromAppointment
  };