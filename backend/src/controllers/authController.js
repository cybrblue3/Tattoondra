// backend/src/controllers/authController.js
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const { PrismaClient } = require('@prisma/client');

  const prisma = new PrismaClient();

  // REGISTER NEW USER

  const register = async (req, res) => {
    try {
      const { email, password, name, phone, role } = req.body;

      // 1. Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Email, password, and name are required'
        });
      }

      // 2. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      // 3. Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 4. Create user in database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: role || 'CLIENT'
        }
      });

      // 5. Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Failed to register user',
        details: error.message
      });
    }
  };
  
  // LOGIN USER

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // 2. Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // 3. Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // 4. Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
      );

      // 5. Send token and user info (without password)
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Failed to login',
        details: error.message
      });
    }
  };

  module.exports = {
    register,
    login
  };