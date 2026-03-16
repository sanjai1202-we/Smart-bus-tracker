const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Sends an SMS message using Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - Message body
 */
const sendSMS = async (to, message) => {
  if (!client) {
    console.warn('[Twilio] Client not configured. SMS not sent:', message);
    return;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: to
    });
    console.log('[Twilio] SMS sent successfully:', result.sid);
    return result;
  } catch (error) {
    console.error('[Twilio] Error sending SMS:', error);
    throw error;
  }
};

module.exports = { sendSMS };
