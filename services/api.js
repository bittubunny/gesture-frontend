import axios from "axios";

const API_URL = "http://localhost:5000";

export const captureHandSign = (userId, landmarks, label) => {
  return axios.post(`${API_URL}/capture`, {
    user_id: userId,
    landmarks: landmarks,
    label: label,
  });
};

export const trainHandSignModel = (userId) => {
  return axios.post(`${API_URL}/train`, { user_id: userId });
};

export const predictHandSign = (userId, landmarks) => {
  return axios.post(`${API_URL}/predict`, {
    user_id: userId,
    landmarks: landmarks,
  });
};
