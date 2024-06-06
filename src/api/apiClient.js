import axios from 'axios';

// TODO: figure out how to get auth0id
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    // Clinician
    'auth0id': '930fdaca095a7f297179fb3dce7206435ece69048342d7c94d0614a09e46ec4b',
    // Admin
    // 'auth0id': '4f8a189ef0fd957582883adedb6ecf97e66ab1f77c2047140ee3332ade3654c4',
  },
});

export default apiClient;
