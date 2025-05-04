import axios from 'axios';

// Singleton Pattern cho instance Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL gốc
  timeout: 10000,                     // Thời gian chờ request
});

// Singleton Pattern cho instance Axios
// const apiClient = axios.create();

export default apiClient;