require('dotenv').config(); 
const axios = require('axios');

// تنظیمات اولیه SendPulse
const sendPulseConfig = {
  apiUrl: 'https://api.sendpulse.com',
  clientId: process.env.api_id, 
  clientSecret: process.env.api_secret 
};

let accessToken = null;

/**
 * گرفتن توکن دسترسی
 * @returns {Promise<string>} - توکن دسترسی
 */
const getAccessToken = async () => {
  try {
    if (!accessToken) {
      const response = await axios.post(`${sendPulseConfig.apiUrl}/oauth/access_token`, {
        grant_type: 'client_credentials',
        client_id: sendPulseConfig.clientId,
        client_secret: sendPulseConfig.clientSecret
      });
      accessToken = response.data.access_token;
    }
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token.');
  }
};

const sendEmail = async (recipients, subject, text, html) => {
    try {
      const token = await getAccessToken();
      const toRecipients = recipients.map(({ email, name }) => ({ email, name }));


      const response = await axios.post(
        `${sendPulseConfig.apiUrl}/smtp/emails`,
        {
          email: {
            from: {
              name: 'Nick Web Project Admin',
              email: process.env.sender // Sender email address
            },
            to: toRecipients, 
            subject,          // Subject
            text,             // Plain text
            html              // HTML content
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new Error('Failed to send email.');
    }
  };
  
  module.exports = sendEmail;