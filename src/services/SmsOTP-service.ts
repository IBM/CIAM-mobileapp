import axios from 'axios';
import Config from 'react-native-config';
const baseUrl = Config.baseUrl;

// Generate email otp
const generateSmsOTP = async (token: any, body: any) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(
      `${baseUrl}/v2.0/factors/smsotp/transient/verifications`,
      body,
      {
        headers: headers,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const verifySmsOTP = async (trxnId: any, token: any, body: any) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(
      `${baseUrl}/v2.0/factors/smsotp/transient/verifications/` +
        trxnId +
        '?returnJwt=true',
      body,
      {
        headers: header,
      },
    );
    return response;
  } catch (error) {
    console.log('error', error)
    throw error;
  }
};

export default {
  generateSmsOTP,
  verifySmsOTP,
};
