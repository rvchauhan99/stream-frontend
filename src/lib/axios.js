import axios from 'axios';
// console.log("process.env.SERVER_URL", process.env.SERVER_URL);
const BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL:BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
