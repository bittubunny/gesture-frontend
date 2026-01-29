import axios from "axios";

// 🔁 Use Render backend in production, localhost in development
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

export const captureHandSign = (userId, landmarks, label) => {
  return api.post("/capture", {
    user_id: userId,
    landmarks,
    label,
  });
};

export const trainHandSignModel = (userId) => {
  return api.post("/train", { user_id: userId });
};

export const predictHandSign = (userId, landmarks) => {
  return api.post("/predict", {
    user_id: userId,
    landmarks,
  });
};
