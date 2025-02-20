import axios from 'axios';

const baseUrl = `${import.meta.env.DEV ? 'http://localhost:1880' : ''}/api`;

export default axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    type: import.meta.env.DEV ? 'cors' : undefined
  }
});

export const axiosPrivate = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    type: import.meta.env.DEV ? 'cors' : undefined
  },
  withCredentials: true
});
