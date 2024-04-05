import axios from 'axios';
import Config from 'react-native-config';
const baseUrl = Config.baseUrl;

// Generate email otp
const generateEmailOTP = async (token: any, body: any) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(
      `${baseUrl}/v2.0/factors/emailotp/transient/verifications`,
      body,
      {
        headers: headers,
      },
    );
    return response;
  } catch (error) {
    console.log('error  here is', error)
    throw error;
  }
};

// Verify email otp

const verifyEmailOTP = async (trxnId: any, token: any, body: any) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(
      `${baseUrl}/v2.0/factors/emailotp/transient/verifications/` +
        trxnId +
        '?returnJwt=true',
      body,
      {
        headers: header,
      },
    );
    return response;
  } catch (error) {
    console.log('error here is', error)
    throw error;
  }
};

export default {
  generateEmailOTP,
  verifyEmailOTP,
};
