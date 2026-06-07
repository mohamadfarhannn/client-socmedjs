import axios from 'axios';
const base_url = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: `${base_url}/api`, 
    withCredentials: true,
});
