/* eslint-disable */

const API_DIMAIN = 'http://0.0.0.0:9999';

export function login(body) {
  return fetch(API_DIMAIN + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => {
    return ({ promise: res.json(), status: res.status });
  });
}

export function registerPoi(body, authToken) {
  return fetch(API_DIMAIN + '/register/poi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(body),
  }).then(res => {
    return ({ promise: res.json(), status: res.status });
  });
}

export function getPoi(authToken) {
  return fetch(API_DIMAIN + '/get/poi', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  }).then(res => {
    return res.json();
  });
}
