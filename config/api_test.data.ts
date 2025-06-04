// Base URL for applications
export const api_url = 'https://reqres.in';

export const httpHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': 'reqres-free-v1',
};

export const payloads = {
  validLogin: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
  },
  updateUser: {
    name: 'morpheus updated',
    job: 'zion resident leader',
  },
  missingPassword: {
    email: 'peter@klaven',
  }
};

// API Endpoints for regres.in
export const endpoints = {
  users: '/api/users/',
  login: '/api/login/',
};