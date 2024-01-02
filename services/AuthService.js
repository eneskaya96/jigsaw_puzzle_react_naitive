//import * as SecureStore from 'expo-secure-store';
import * as Keychain from 'react-native-keychain';
import {SAAS_BASE_URL} from '../utilities/Constants';

export async function loginReq(_email, _password) {
  try {
    const response = await fetch(SAAS_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: _email,
        password: _password,
      }),
    });

    const res_json = await response.json();
    if (res_json.success) {
      //await SecureStore.setItemAsync('access_token', res_json.data.access_token);
      await Keychain.setGenericPassword(
        'access_token',
        res_json.data.access_token,
      );
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function registerReq(_email, _password) {
  try {
    const response = await fetch(SAAS_BASE_URL + 'auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: _email,
        password: _password,
      }),
    });

    const res_json = await response.json();
    if (res_json.success) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function validTokenReq() {
  //const token = await SecureStore.getItemAsync('access_token');
  const token = await getToken();
  console.log('token', token);
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(SAAS_BASE_URL + 'auth/valid/token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    const res_json = await response.json();
    if (res_json.success) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function getToken() {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error when getting token from local store', error);
    return null;
  }
}
