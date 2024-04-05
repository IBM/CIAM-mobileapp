import axios from 'axios';
import Config from 'react-native-config';

const baseUrl = Config.baseUrl;

const getToken = async refreshToken => {
  const body: any = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: Config.client_id,
    client_secret: Config.client_secret,
  };
  try {
    const response = await axios.post(`${baseUrl}/oauth2/token`, body, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getToken,
};
