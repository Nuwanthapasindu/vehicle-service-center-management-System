const axios = require('axios');


function createSmsClient() {
  const SMS_GATEWAY_BASE_URL = process.env.SMS_GATEWAY_BASE_URL || null;
  const SMS_GATEWAY_USER_ID = process.env.SMS_GATEWAY_USER_ID || null;
  const SMS_GATEWAY_API_KEY = process.env.SMS_GATEWAY_API_KEY || null;
  if (!SMS_GATEWAY_BASE_URL || !SMS_GATEWAY_USER_ID || !SMS_GATEWAY_API_KEY) {
    throw new Error('SMS gateway configuration variables are not set properly in the environment file.');
  }
  return axios.create({
    baseURL: SMS_GATEWAY_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      user_id: SMS_GATEWAY_USER_ID,
      api_key: SMS_GATEWAY_API_KEY,
    },
  });
};
module.exports = {
  createSmsClient
};