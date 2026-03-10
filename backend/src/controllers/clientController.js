const { PrismaClient } = require('@prisma/client');

  const prisma = new PrismaClient();

  // GET ALL CLIENTS (with optional search)
  
  const getAllClients = async (req, res) => {
    try {
      const { search } = req.query;

      // Build filter conditions
      const where = {
        role: 'CLIENT'  // Only get clients, not admins
      };

      // If search query provided, filter by name, email, or phone
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ];
      }

      const clients = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          // Don't send password!
        },
        orderBy: {
          createdAt: 'desc'  // Newest first
        }
      });

      res.json({
        success: true,
        count: clients.length,
        clients
      });
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clients',
        details: error.message
      });
    }
  };

  // GET ONE CLIENT BY ID

  const getClientById = async (req, res) => {
    try {
      const { id } = req.params;

      const client = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          // Include related appointments (for future use)
          clientAppointments: {
            select: {
              id: true,
              date: true,
              status: true,
              totalPrice: true,
              depositReceived: true
            },
            orderBy: {
              date: 'desc'
            }
          }
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Verify it's actually a client (not admin)
      if (client.role !== 'CLIENT') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      res.json({
        success: true,
        client
      });
    } catch (error) {
      console.error('Get client by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client',
        details: error.message
      });
    }
  };

  // CREATE NEW CLIENT
  
  const createClient = async (req, res) => {
    try {
      const { email, name, phone } = req.body;

      // Validate required fields
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required'
        });
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'A user with this email already exists'
        });
      }

      // Create client (no password needed - clients don't log in)
      const client = await prisma.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          password: 'N/A',  // Clients don't need passwords
          role: 'CLIENT'
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        client
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create client',
        details: error.message
      });
    }
  };

  // UPDATE CLIENT
  
  const updateClient = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, name, phone } = req.body;

      // Check if client exists
      const existingClient = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingClient || existingClient.role !== 'CLIENT') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // If email is being changed, check it's not taken
      if (email && email !== existingClient.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email }
        });

        if (emailTaken) {
          return res.status(409).json({
            success: false,
            error: 'Email already in use'
          });
        }
      }

      // Update client
      const updatedClient = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(name && { name }),
          ...(phone !== undefined && { phone })
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        message: 'Client updated successfully',
        client: updatedClient
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update client',
        details: error.message
      });
    }
  };

  // DELETE CLIENT
  
  const deleteClient = async (req, res) => {
    try {
      const { id } = req.params;

      // Check if client exists
      const existingClient = await prisma.user.findUnique({
        where: { id },
        include: {
          clientAppointments: true
        }
      });

      if (!existingClient || existingClient.role !== 'CLIENT') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Check if client has appointments
      if (existingClient.clientAppointments.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete client with existing appointments',
          appointmentCount: existingClient.clientAppointments.length
        });
      }

      // Delete client
      await prisma.user.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete client',
        details: error.message
      });
    }
  };

  module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
  };