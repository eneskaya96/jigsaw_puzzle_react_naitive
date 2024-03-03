//import * as SecureStore from 'expo-secure-store';
import {SAAS_BASE_URL} from '../utilities/Constants';
import {getToken} from './AuthService';

export async function get_all_images() {
  try {
    const response = await fetch(SAAS_BASE_URL + 'image/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const res_json = await response.json();
    if (res_json.success) {
      return res_json.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

export async function get_image_puzzles(image_id) {
  try {
    const response = await fetch(SAAS_BASE_URL + `image/${image_id}/puzzles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const res_json = await response.json();
    if (res_json.success) {
      return res_json.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

export async function start_puzzle(puzzle_id) {
  try {
    const response = await fetch(SAAS_BASE_URL + `puzzle/${puzzle_id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const res_json = await response.json();
    if (res_json.success) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export async function get_puzzle_pieces(
  puzzle_id,
  status,
  limit = 10,
  offset = 0,
) {
  try {
    const response = await fetch(
      SAAS_BASE_URL +
        `puzzle/${puzzle_id}/pieces/${status}?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const res_json = await response.json();
    if (res_json.success) {
      return res_json.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

export async function save_puzzle(
    _puzzle_id,
    _pieces,
  ) {
    try {
      const response = await fetch(
        SAAS_BASE_URL +
          `puzzle/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
          },
          body: JSON.stringify({
            puzzle_id: _puzzle_id,
            pieces: _pieces,
          }),
        },
      );
  
      const res_json = await response.json();
      if (res_json.success) {
        return true
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
