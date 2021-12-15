/* eslint-disable */

const API_DOMAIN = 'http://0.0.0.0:9999';
const WS_DOMAIN = 'ws://0.0.0.0:9999';

export function login(body) {
  return fetch(API_DOMAIN + '/login', {
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
  return fetch(API_DOMAIN + '/register/poi', {
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

export function getPois(authToken) {
  return fetch(API_DOMAIN + '/get/poi', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  }).then(res => {
    return ({ promise: res.json(), status: res.status });
  });
}

export function registerTransit(body, authToken) {
  return fetch(API_DOMAIN + '/register/transit', {
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

export function registerAlert(body, authToken) {
  return fetch(API_DOMAIN + '/register/alert', {
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

export function liveSocket() {
  return new WebSocket(WS_DOMAIN + '/live');
}
