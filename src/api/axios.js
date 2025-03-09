import axios from "axios";

const BASE_URL = 'http://localhost:5173';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {"Content-Type": "application/json"},
});