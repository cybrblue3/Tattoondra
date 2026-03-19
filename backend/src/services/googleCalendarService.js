const { google } = require('googleapis');
  const { PrismaClient } = require('@prisma/client');

  const prisma = new PrismaClient();

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  /**
   * Get valid access token for a user, refreshing if needed
   * @param {string} userId - User ID
   * @returns {Promise<string>} Valid access token
   */
  async function getValidAccessToken(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
      },
    });

    if (!user.googleRefreshToken) {
      throw new Error('User has not connected Google Calendar');
    }

    // Check if token is expired or about to expire (5 minute buffer)
    const now = new Date();
    const expiryWithBuffer = new Date(user.googleTokenExpiry.getTime() - 5 * 60 * 1000);

    if (now >= expiryWithBuffer) {
      console.log('Token expired, refreshing...');
      // Token expired, refresh it
      oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      // Update database with new token
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleTokenExpiry: new Date(credentials.expiry_date),
        },
      });

      return credentials.access_token;
    }

    // Token still valid
    return user.googleAccessToken;
  }

  /**
   * Create a Google Calendar event
   * @param {string} userId - User ID (artist)
   * @param {object} appointmentData - Appointment details
   * @returns {Promise<string>} Google Calendar event ID
   */
  async function createCalendarEvent(userId, appointmentData) {
    try {
      const accessToken = await getValidAccessToken(userId);

      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Calculate end time
      const startDateTime = new Date(appointmentData.date);
      const endDateTime = new Date(startDateTime.getTime() + appointmentData.duration * 60000);

      const event = {
        summary: `Cita: ${appointmentData.clientName}`,
        description: appointmentData.description || 'Cita de tatuaje',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 },
            { method: 'popup', minutes: 1440 }, // 24 hours
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log('Calendar event created:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error.message);
      throw error;
    }
  }

  /**
   * Update a Google Calendar event
   * @param {string} userId - User ID (artist)
   * @param {string} eventId - Google Calendar event ID
   * @param {object} appointmentData - Updated appointment details
   */
  async function updateCalendarEvent(userId, eventId, appointmentData) {
    try {
      const accessToken = await getValidAccessToken(userId);

      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Calculate end time
      const startDateTime = new Date(appointmentData.date);
      const endDateTime = new Date(startDateTime.getTime() + appointmentData.duration * 60000);

      const event = {
        summary: `Cita: ${appointmentData.clientName}`,
        description: appointmentData.description || 'Cita de tatuaje',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
      };

      await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      console.log('Calendar event updated:', eventId);
    } catch (error) {
      console.error('Error updating calendar event:', error.message);
      throw error;
    }
  }

  /**
   * Delete a Google Calendar event
   * @param {string} userId - User ID (artist)
   * @param {string} eventId - Google Calendar event ID
   */
  async function deleteCalendarEvent(userId, eventId) {
    try {
      const accessToken = await getValidAccessToken(userId);

      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      console.log('Calendar event deleted:', eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error.message);
      throw error;
    }
  }

  module.exports = {
    getValidAccessToken,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  };