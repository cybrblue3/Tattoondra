// Google Calendar OAuth Routes
  const express = require('express');
  const router = express.Router();
  const { google } = require('googleapis');
  const { PrismaClient } = require('@prisma/client');
  const { verifyToken } = require('../middleware/authMiddleware');

  const prisma = new PrismaClient();

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Scopes: What permissions we're requesting
  const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

  // GET /api/auth/google - Redirect to Google login
  router.get('/google', (req, res) => {
    try {
      console.log('🔵 Google OAuth route hit!');
      // Get token from query parameter
      const token = req.query.token;
      console.log('🔵 Token received:', token ? 'YES' : 'NO');

      if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify token manually
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified, user ID:', decoded.id);

      // Generate Google OAuth URL with user ID in state
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state: decoded.id,
        prompt: 'consent', // Force consent screen to get refresh token
      });
      console.log('✅ Auth URL generated:', authUrl);

      console.log('🔵 Redirecting to Google...');
      res.redirect(authUrl);
    } catch (error) {
      console.error('❌ Error generating auth URL:', error);
      res.status(500).json({ error: 'Failed to initiate Google authentication' });
    }
  });

  // GET /api/auth/google/callback - Receive code and exchange for tokens
  router.get('/google/callback', async (req, res) => {
    try {
      const { code, state } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'No authorization code received' });
      }

      const userId = state;
      if (!userId) {
        return res.status(400).json({ error: 'Invalid state parameter' });
      }

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);

      // Calculate expiry date
      const expiryDate = new Date(tokens.expiry_date);

      // Store tokens in database
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiry: expiryDate,
        },
      });

      // Redirect back to frontend
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? 'https://tattoondra.vercel.app'
        : 'http://localhost:5173';

      res.redirect(`${frontendUrl}/dashboard?calendar=connected`);
    } catch (error) {
      console.error('Error in callback:', error);
      res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
  });

  // GET /api/auth/google/status - Check connection status
  router.get('/google/status', verifyToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      const connected = !!user.googleRefreshToken;

      res.json({ connected, tokenExpiry: user.googleTokenExpiry });
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Failed to check connection status' });
    }
  });

  // POST /api/auth/google/disconnect - Disconnect calendar
  router.post('/google/disconnect', verifyToken, async (req, res) => {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          googleAccessToken: null,
          googleRefreshToken: null,
          googleTokenExpiry: null,
        },
      });

      res.json({ message: 'Google Calendar disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting:', error);
      res.status(500).json({ error: 'Failed to disconnect' });
    }
  });

  module.exports = router;