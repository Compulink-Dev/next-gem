// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : '',
  withCredentials: true,
});
