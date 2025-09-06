// src/services/api.js
import axios from "axios";

// Backend URL
const API_URL = "http://localhost:5000";

/**
 * Signup a new user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} user data + token
 */
export const signup = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, { username, password });
    return res.data;
  } catch (err) {
    // Throw a friendly error message
    throw err.response?.data || { message: "Signup failed" };
  }
};

/**
 * Login an existing user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} user data + token
 */
export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    return res.data; // { username, token }
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};
