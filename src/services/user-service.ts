import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const baseUrl = Config.baseUrl;

// Get access token
const generateAccessToken = async () => {
  const body = {
    grant_type: 'client_credentials',
    scope: Config.scope,
    client_id: Config.api_client_id,
    client_secret: Config.api_client_secret,
  };
  try {
    const response = await axios.post(
      `${baseUrl}/oauth2/token`,
      new URLSearchParams(body).toString(),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Create new user
const createUser = async (body: any, token: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: 'application/scim+json',
    'content-type': 'application/scim+json',
    usershouldnotneedtoresetpassword: true,
  };
  try {
    const response = await axios.post(`${baseUrl}/v2.0/Users`, body, {
      headers: headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user data
const getUserData = async (token: any) => {
  const headers = {
    usershouldnotneedtoresetpassword: false,
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.get(`${baseUrl}/v2.0/Me`, {
      headers: headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getAccessToken = async token => {
  const headers = {
    'content-Type': 'application/x-www-form-urlencoded',
  };
  let challenge = await AsyncStorage.getItem('challenge');
  const body = {
    grant_type: 'authorization_code',
    code: token,
    redirect_uri: 'http://localhost:8081/home',
    client_id: Config.client_id,
    client_secret: Config.client_secret,
    scope: Config.scope,
    code_verifier: JSON.parse(challenge).codeVerifier,
  };

  try {
    const response = await axios.post(`${baseUrl}/oauth2/token`, body, {
      headers: headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getStats = async token => {
  try {
    const headers = {
      access_token: token,
      'content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    };
    let response = await axios.get('http://192.168.1.15:5000/user/stats', {
      headers: headers,
    });
    return response;
  } catch (error) {
  }
};

const updateUserData = async (token: any, body: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/scim+json',
  };
  try {
    const response = await axios.put(`${baseUrl}/v2.0/Me`, body, {
      headers: headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (token: any) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.delete(`${baseUrl}/v2.0/Me`, {
      headers: header,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  generateAccessToken,
  createUser,
  getUserData,
  getAccessToken,
  getStats,
  updateUserData,
  deleteUser,
};
