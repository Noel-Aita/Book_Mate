import axios from "axios";

const API_URL = "http://localhost:5000";

export const signup = async (username, password) => {
  const res = await axios.post(`${API_URL}/signup`, { username, password });
  return res.data;
};

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data; // { username, token }
};
